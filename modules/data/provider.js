/*global module, require*/
var analytics = require('api/analytics'),
	config = require('../../config/config.json'),
	parser = require('data/parser'),
	q = require('q');

function get() {
	var promises = [];
	config.queries.forEach(function (query) {
		promises.push(analytics.runQuery(query.viewIds, query.metrics, query.dimensions, query.filters));
	});

	return q.all(promises)
		.then(function (data) {
			var queriesData = [],
				queryId = 0;

			data.forEach(function (queryData) {
				queriesData.push(parser.parse(queryData, config.queries[queryId]));
				queryId++;
			});

			return {
				queries: queriesData
			};
		});
}

module.exports = {
	get: get
};