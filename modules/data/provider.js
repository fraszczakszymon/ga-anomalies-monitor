/*global module, require*/
var analytics = require('api/analytics'),
	config = require('../../config/config.json'),
	q = require('q');

function parseDate(row, metricsCount) {
	var margin = metricsCount + 1,
		date = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(row[row.length - margin - 1] + row[row.length - margin]);

	return new Date(date[1], date[2]-1, date[3], date[4], 0, 0, 0);
}

function filterRows(rows) {
	var newRows = [],
		valuePosition = rows[0].length - 1;

	for (var i = 0; i < rows.length; i++) {
		if (rows[i+1] && rows[i+1][valuePosition] !== '0') {
			newRows.push(rows[i]);
		}
	}

	return newRows;
}

function predictData(collection, threshold) {
	var alpha = 0.95,
		beta = 0.13,
		current,
		growthTrends,
		smoothedValues,
		value;

	threshold = threshold || 20;
	smoothedValues = [ collection.data.real[0].value ];
	growthTrends = [ collection.data.real[1].value - collection.data.real[0].value ];
	collection.data.expected = [ collection.data.real[0] ];
	for (var i = 1; i < collection.data.real.length; i++) {
		current = collection.data.real[i];
		smoothedValues.push(alpha * current.value + (1-alpha) * (smoothedValues[i-1] + growthTrends[i-1]));
		growthTrends.push(beta * (smoothedValues[i] - smoothedValues[i-1]) + (1-beta) * growthTrends[i-1]);
		value = smoothedValues[i-1] + growthTrends[i-1];
		collection.data.expected.push({
			date: collection.data.real[i].date,
			value: Math.round(value),
			error: (current.value - value) / current.value * 100
		});
		if (collection.data.expected[i].error >= threshold) {
			collection.data.expected[i].exceeded = true;
		}
	}
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
		expected: []
	};
	filterRows(originalData.rows).forEach(function (row) {
		collection.data.real.push({
			date: parseDate(row, metricsCount),
			value: parseInt(row[row.length - 1], 10)
		});
	});
	predictData(collection);

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