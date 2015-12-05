/*global module*/

function getMedian(data) {
	var values = [],
		half;
	data.forEach(function (row) {
		if (row.value !== 0) {
			values.push(row.value);
		}
	});
	values.sort(function (a,b) { return a - b; });
	half = Math.floor(values.length/2);

	if (values.length % 2) {
		return values[half];
	}

	return (values[half-1] + values[half]) / 2.0;
}

function getLevel(alpha, value, previousLevel, previousTrend) {
	return alpha * value + (1-alpha) * (previousLevel + previousTrend);
}

function getTrend(beta, level, previousLevel, previousTrend) {
	return beta * (level - previousLevel) + (1-beta) * previousTrend;
}

function getForecastRow(date, threshold, value, forecast) {
	var max = forecast + threshold,
		min = Math.max(forecast - threshold, 0),
		row = {
			date: date,
			value: {
				min: min,
				forecast: Math.round(forecast),
				max: max
			},
			error: forecast - value
		};

	if (value > max || value < min) {
		row.exceeded = true;
	}

	return row;
}

function predict(collection, query) {
	var current,
		errors = 0,
		forecast,
		forecastRow,
		levels,
		threshold,
		trends;

	levels = [ collection.data.real[0].value ];
	trends = [ collection.data.real[1].value - collection.data.real[0].value ];
	collection.data.forecast = [];
	threshold = getMedian(collection.data.real) * query.threshold;
	forecastRow = getForecastRow(
		collection.data.real[0].date,
		threshold,
		collection.data.real[0].value,
		collection.data.real[0].value
	);
	collection.data.forecast.push(forecastRow);
	for (var i = 1; i < collection.data.real.length; i++) {
		current = collection.data.real[i];
		levels.push(getLevel(query.alpha, current.value, levels[i-1], trends[i-1]));
		trends.push(getTrend(query.beta, levels[i], levels[i-1], trends[i-1]));
		forecast = levels[i-1] + trends[i-1];
		forecastRow = getForecastRow(collection.data.real[i].date, threshold, current.value, forecast);
		collection.data.forecast.push(forecastRow);
		if (forecastRow.exceeded) {
			errors++;
		}
	}

	return errors;
}

module.exports = {
	predict: predict
};