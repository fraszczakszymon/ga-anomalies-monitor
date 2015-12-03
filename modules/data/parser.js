/*global module, require*/
var moment = require('moment-timezone'),
	profiles = require('api/profiles'),
	seer = require('data/seer'),
	strainer = require('data/strainer');

function parseDate(row, metricsCount, timezone) {
	var margin = metricsCount + 1,
		date = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(row[row.length - margin - 1] + row[row.length - margin]);

	return moment.tz({
		year: date[1],
		month: date[2] - 1,
		day: date[3],
		hour: date[4]
	}, timezone);
}

function parse(originalData, queryDetails) {
	var collection = {
			id: originalData.query.ids
		},
		metricsCount = originalData.query.metrics.length,
		name = '',
		profile = profiles.get(collection.id) || {};

	for (var i = 0; i <= originalData.rows[0].length - 3 - metricsCount; i++) {
		name += originalData.rows[0][i] + ' ';
	}
	if (name !== '') {
		collection.name = name.trim();
	}
	collection.title = queryDetails.title;
	collection.data = {
		real: [],
		forecast: []
	};
	strainer.filter(originalData.rows).forEach(function (row) {
		collection.data.real.push({
			date: parseDate(row, metricsCount, profile.timezone),
			value: parseInt(row[row.length - 1], 10)
		});
	});
	collection.errors = seer.predict(collection, queryDetails);

	return collection;
}

module.exports = {
	parse: parse
};