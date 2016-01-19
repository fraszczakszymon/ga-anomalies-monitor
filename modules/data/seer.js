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

function getForecastRow(threshold, value, forecast) {
	var max = forecast + threshold,
		min = Math.max(forecast - threshold, 0),
		row = {
			error: forecast - value,
			value: Math.round(forecast),
			max: max,
			min: min
		};

	if (value > max || value < min) {
		row.exceeded = true;
	}

	return row;
}

function pushForecastData(collection, index, forecast) {
	collection.data[index].error = forecast.error;
	collection.data[index].forecast = forecast.value;
	collection.data[index].max = forecast.max;
	collection.data[index].min = forecast.min;

	if (forecast.exceeded) {
		collection.data[index].exceeded = true;
	}
}

function predict(collection, query) {
	var current,
		errors = 0,
		forecast,
		forecastRow,
		levels,
		threshold,
		trends;

	levels = [ collection.data[0].value ];
	trends = [ collection.data[1].value - collection.data[0].value ];
	threshold = getMedian(collection.data) * query.threshold;
	forecastRow = getForecastRow(
		threshold,
		collection.data[0].value,
		collection.data[0].value
	);
	pushForecastData(collection, 0, forecastRow);
	for (var i = 1; i < collection.data.length; i++) {
		current = collection.data[i];
		levels.push(getLevel(query.alpha, current.value, levels[i-1], trends[i-1]));
		trends.push(getTrend(query.beta, levels[i], levels[i-1], trends[i-1]));
		forecast = Math.max(levels[i-1] + trends[i-1], 0);
		forecastRow = getForecastRow(threshold, current.value, forecast);
		pushForecastData(collection, i, forecastRow);
		if (forecastRow.exceeded) {
			errors++;
		}
	}

	return errors;
}

module.exports = {
	predict: predict
};