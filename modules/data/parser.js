/*global module, require*/
var seer = require('data/seer'),
	strainer = require('data/strainer');

function parseDate(row, metricsCount) {
	var margin = metricsCount + 1,
		date = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(row[row.length - margin - 1] + row[row.length - margin]);

	return new Date(date[1], date[2]-1, date[3], date[4], 0, 0, 0);
}

function parse(originalData) {
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
	strainer.filter(originalData.rows).forEach(function (row) {
		collection.data.real.push({
			date: parseDate(row, metricsCount),
			value: parseInt(row[row.length - 1], 10)
		});
	});
	seer.predict(collection);

	return collection;
}

module.exports = {
	parse: parse
};