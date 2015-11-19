/*global module*/

function getMedian(data) {
	var values = [],
		half;
	data.forEach(function (row) {
		values.push(row.value);
	});
	values.sort(function (a,b) { return a - b; });
	half = Math.floor(values.length/2);

	if(values.length % 2)
		return values[half];
	else
		return (values[half-1] + values[half]) / 2.0;
}

function getMean(data) {
	var sum = 0;
	data.forEach(function (row) {
		sum += row.value;
	});

	return sum/data.length;
}

function getLevel(alpha, value, previousLevel, previousTrend) {
	return alpha * value + (1-alpha) * (previousLevel + previousTrend);
}

function getTrend(beta, level, previousLevel, previousTrend) {
	return beta * (level - previousLevel) + (1-beta) * previousTrend;
}

function predict(collection, query) {
	var collectionThreshold,
		current,
		errors = 0,
		forecast,
		levels,
		trends;

	collectionThreshold = getMedian(collection.data.real) * query.threshold;
	levels = [ collection.data.real[0].value ];
	trends = [ collection.data.real[1].value - collection.data.real[0].value ];
	collection.data.forecast = [];
	collection.data.forecast.push({
		date: collection.data.real[0].date,
		value: {
			min: collection.data.real[0].value - collectionThreshold,
			forecast: collection.data.real[0].value,
			max: collection.data.real[0].value + collectionThreshold
		},
		error: 0
	});
	for (var i = 1; i < collection.data.real.length; i++) {
		current = collection.data.real[i];
		levels.push(getLevel(query.alpha, current.value, levels[i-1], trends[i-1]));
		trends.push(getTrend(query.beta, levels[i], levels[i-1], trends[i-1]));
		forecast = levels[i-1] + trends[i-1];
		collection.data.forecast.push({
			date: collection.data.real[i].date,
			value: {
				min: Math.max(forecast - collectionThreshold, 0),
				forecast: Math.round(forecast),
				max: forecast + collectionThreshold
			},
			error: forecast - current.value
		});
		if (Math.abs(collection.data.forecast[i].error) >= collectionThreshold) {
			collection.data.forecast[i].exceeded = true;
			errors++;
		}
	}

	return errors;
}

module.exports = {
	predict: predict
};