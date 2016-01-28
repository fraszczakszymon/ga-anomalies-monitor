/*global module, require*/
var config = require('../../config/config.json'),
	moment = require('moment-timezone'),
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

function getFirstDate(timezone) {
	return moment()
		.tz(timezone)
		.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0)
		.add(-1 * config.settings.timeSpan, 'days');
}

function prepareCollection(queryDetails) {
	return {
		id: queryDetails.id,
		title: queryDetails.title,
		description: queryDetails.description,
		data: []
	};
}

function createEmptyRows(timezone, lastDate) {
	var data = {},
		date = getFirstDate(timezone);
	while (lastDate > date) {
		data[date.format()] = 0;
		date.add(1, 'hours');
	}

	return data;
}

function saveData(collection, rows, data, metricsCount, timezone) {
	var date,
		value;
	data.forEach(function (dataRow) {
		date = parseDate(dataRow, metricsCount, timezone);
		value = parseInt(dataRow[dataRow.length - 1], 10);
		rows[date.format()] = value;
	});
	Object.keys(rows).forEach(function (date) {
		collection.data.push({
			date: date,
			value: rows[date]
		});
	});
}

function parse(originalData, queryDetails) {
	var collection = prepareCollection(queryDetails),
		date,
		filteredData,
		metricsCount = originalData.query.metrics.length,
		profile = profiles.get(originalData.query.ids) || {},
		rows,
		timezone = profile.timezone || 'Europe/London';

	if (originalData.rows) {
		filteredData = strainer.filter(originalData.rows);
		date = parseDate(filteredData[filteredData.length - 1], metricsCount, timezone);
	} else {
		filteredData = [];
		date = moment()
			.tz(timezone);
	}
	rows = createEmptyRows(timezone, date);
	saveData(collection, rows, filteredData, metricsCount, timezone);
	collection.errors = seer.predict(collection, queryDetails);

	return collection;
}

module.exports = {
	parse: parse
};