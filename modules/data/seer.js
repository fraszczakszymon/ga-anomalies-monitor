/*global module*/
var alpha = 0.95,
	beta = 0.13;

function getLevel(value, previousLevel, previousTrend) {
	return alpha * value + (1-alpha) * (previousLevel + previousTrend);
}

function getTrend(level, previousLevel, previousTrend) {
	return beta * (level - previousLevel) + (1-beta) * previousTrend;
}

function predict(collection, threshold, alpha, beta) {
	var current,
		forecast,
		trends,
		levels;

	threshold = threshold || 20;
	levels = [ collection.data.real[0].value ];
	trends = [ collection.data.real[1].value - collection.data.real[0].value ];
	collection.data.forecast = [ collection.data.real[0] ];
	for (var i = 1; i < collection.data.real.length; i++) {
		current = collection.data.real[i];
		levels.push(getLevel(current.value, levels[i-1], trends[i-1]));
		trends.push(getTrend(levels[i], levels[i-1], trends[i-1]));
		forecast = levels[i-1] + trends[i-1];
		collection.data.forecast.push({
			date: collection.data.real[i].date,
			value: Math.round(forecast),
			error: (forecast - current.value) / current.value * 100
		});
		if (Math.abs(collection.data.forecast[i].error) >= threshold) {
			collection.data.forecast[i].exceeded = true;
		}
	}
}

module.exports = {
	predict: predict
};