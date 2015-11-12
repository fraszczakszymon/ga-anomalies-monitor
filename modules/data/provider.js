/*global module, require*/
var analytics = require('api/analytics'),
	config = require('../../config/config.json'),
	parser = require('data/parser'),
	q = require('q');

function get() {
	var promises = [],
		viewIds;
	config.queries.forEach(function (query) {
		viewIds = query.viewIds;
		promises.push(analytics.runQuery(viewIds, query.metrics, query.dimensions, query.filters));
	});
	if (viewIds) {
		promises.push(analytics.getPageViews(viewIds));
	}

	return q.all(promises)
		.then(function (data) {
			var pageviews = data[data.length - 1],
				queries = data.slice(0, -1),
				queriesData = [];

			//queries.forEach(function (query) {
			//	queriesData.push(parser.parse(query));
			//});

			return {
				pageviews: parser.parse(pageviews),
				queries: queriesData
			};
		});
}

module.exports = {
	get: get
};