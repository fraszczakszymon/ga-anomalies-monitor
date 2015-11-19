/*global module, require*/
var analytics = require('api/analytics'),
	config = require('../../config/config.json'),
	parser = require('data/parser'),
	q = require('q');

function fetch(queries, extra) {
	var promises = [];
	queries.forEach(function (query) {
		promises.push(analytics.runQuery(query.viewIds, query.metrics, query.dimensions, query.filters, extra));
	});

	return q.all(promises);
}

function get() {
	return fetch(config.queries).then(function (data) {
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
	fetch: fetch,
	get: get
};