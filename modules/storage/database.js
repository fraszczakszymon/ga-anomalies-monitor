/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var db,
	buildsRepository = require('storage/buildsRepository'),
	file = "./database/ga_data.db",
	sqlite3 = require("sqlite3").verbose();

function init() {
	db = new sqlite3.Database(file);

	db.serialize(function () {
		db.run("CREATE TABLE IF NOT EXISTS builds (" +
			"id INTEGER PRIMARY KEY AUTOINCREMENT," +
			"date TEXT," +
			"data TEXT," +
			"duration REAL," +
			"status INTEGER" +
		");");
	});
}

function getBuildsRepository() {
	return buildsRepository.getInstance(db);
}

module.exports = {
	init: init,
	getBuildsRepository: getBuildsRepository
};