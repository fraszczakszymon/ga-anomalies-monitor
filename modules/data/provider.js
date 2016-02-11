/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var analytics = require('api/analytics'),
	config,
	parser = require('data/parser'),
	profiles = require('api/profiles'),
	q = require('q');

function fetch(queries, extra) {
	var breakBetweenQueries = 2000,
		currentTimeout = breakBetweenQueries,
		promises = [];

	extra = extra || {};
	queries.forEach(function (query) {
		extra.timeout = currentTimeout;
		promises.push(analytics.runQuery(query.viewIds, query.metrics, query.dimensions, query.filters, extra));
		currentTimeout += breakBetweenQueries;
	});

	return q.all(promises);
}

function get() {
	config = require('../../config/config.json');
	return profiles.fetch()
		.then(function () {
			return fetch(config.queries);
		})
		.then(function (data) {
			var queriesData = [],
				queryId = 0;

			data.forEach(function (queryData) {
				if (config.queries[queryId].enabled) {
					queriesData.push(parser.parse(queryData, config.queries[queryId]));
				}
				queryId++;
			});

			return {
				queries: queriesData
			};
		});
}

module.exports = {
	fetch: fetch,
	get: get
};
