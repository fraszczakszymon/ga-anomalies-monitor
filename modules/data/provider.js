/*global module, require*/
var analytics = require('api/analytics'),
	config = require('../../config/config.json'),
	seer = require('data/seer'),
	q = require('q');

function parseDate(row, metricsCount) {
	var margin = metricsCount + 1,
		el = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(row[row.length - margin - 1] + row[row.length - margin]),
		date = new Date(el[1], el[2]-1, el[3], el[4], 0, 0, 0);

	return date + '';
}

function filterRows(rows) {
	var i,
		newRows = [],
		valuePosition = rows[0].length - 1,
		valuesToSkip = 1;

	for (i = rows.length-1; i >= 0; i--, valuesToSkip++) {
		if (rows[i][valuePosition] !== '0') {
			break;
		}
	}
	for (i = 0; i < rows.length - valuesToSkip; i++) {
		newRows.push(rows[i]);
	}

	return newRows;
}

function parseData(originalData) {
	var collection = {
			id: originalData.query.ids
		},
		metricsCount = originalData.query.metrics.length,
		name = '';

	for (var i = 0; i <= originalData.rows[0].length - 3 - metricsCount; i++) {
		name += originalData.rows[0][i] + ' ';
	}
	if (name !== '') {
		collection.name = name.trim();
	}
	collection.data = {
		real: [],
		forecast: []
	};
	filterRows(originalData.rows).forEach(function (row) {
		collection.data.real.push({
			date: parseDate(row, metricsCount),
			value: parseInt(row[row.length - 1], 10)
		});
	});
	seer.predict(collection);

	return collection;
}

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
			//	queriesData.push(parseData(query));
			//});

			return {
				pageviews: parseData(pageviews),
				queries: queriesData
			};
		});
}

module.exports = {
	get: get
};