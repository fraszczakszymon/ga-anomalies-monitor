/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var parser = require('data/parser'),
	provider = require('data/provider');

function getVariance(data) {
	var mean,
		sum = 0;
	data.forEach(function (row) {
		sum += row.error;
	});
	mean = sum / data.length;
	sum = 0;
	data.forEach(function (row) {
		sum += Math.pow(row.error - mean, 2);
	});

	return sum / data.length;
}

function calculate(query) {
	return provider.fetch([query])
		.then(function (queryData) {
			var alpha = 1,
				beta = 0.01,
				currentData,
				bestAlpha, bestBeta, lowestVariance, variance;

			for (; alpha >= 0.01; alpha -= 0.025) {
				query.alpha = alpha;
				beta = 0.01;
				for (; beta <= 1; beta += 0.025) {
					query.beta = beta;
					currentData = parser.parse(queryData[0], query);
					variance = getVariance(currentData.data);
					if (!lowestVariance || lowestVariance > variance) {
						lowestVariance = variance;
						bestAlpha = alpha;
						bestBeta = beta;
					}
				}
			}

			return [bestAlpha, bestBeta];
		});
}

module.exports = {
	calculate: calculate
};