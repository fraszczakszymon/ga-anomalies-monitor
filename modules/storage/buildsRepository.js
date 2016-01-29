/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var moment = require('moment-timezone'),
	q = require('q');

function getInstance(db) {
	var STATUS = {
		done: 0,
		pending: 1,
		error: 2
	};

	function create() {
		var deferred = q.defer();
		db.run("INSERT INTO builds (date, data, duration, status) VALUES (?, ?, ?, ?);",
			moment().format(),
			null,
			0,
			STATUS.pending,
			function (err) {
				if (err) {
					return deferred.reject(err);
				}
				get(this.lastID)
					.then(function (build) {
						deferred.resolve(build);
					});
			}
		);

		return deferred.promise;
	}

	function get(id) {
		var deferred = q.defer(),
			onFetch = function (err, rows) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(rows[0]);
				}
			};

		db.all("SELECT * FROM builds WHERE id = ?", parseInt(id, 10), onFetch);

		return deferred.promise;
	}

	function getAll() {
		var deferred = q.defer(),
			onFetch = function (err, rows) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(rows);
				}
			};

		db.all("SELECT id, date, duration, status FROM builds ORDER BY id DESC LIMIT 1000", onFetch);

		return deferred.promise;
	}

	function update(id, data, duration, status) {
		db.run("UPDATE builds SET data = ?, duration = ?, status = ? WHERE id = ?;",
			JSON.stringify(data),
			duration,
			status,
			id
		);
	}

	return {
		create: create,
		get: get,
		getAll: getAll,
		update: update,
		STATUS: STATUS
	};
}

module.exports = {
	getInstance: getInstance
};