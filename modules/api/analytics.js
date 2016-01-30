/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var api = require('api/api'),
	analytics = require('googleapis').analytics('v3'),
	config,
	logger = require('utils/logger'),
	q = require('q');

function prepareQueryParam(params) {
	if (!params) {
		return;
	}
	return params.map(function (param) {
			return 'ga:' + param;
		})
		.join(',');
}

function getProfiles() {
	var deferred = q.defer();
	api.authenticate()
		.then(function (authClient) {
			analytics.management.profiles.list({
				'auth': authClient,
				'accountId': '~all',
				'webPropertyId': '~all'
			}, function (err, result) {
				if (err) {
					logger.error('getProfiles', {
						error: err
					});
					deferred.reject(err);
				} else {
					logger.info('getProfiles', {
						results: result.items.length
					});
					deferred.resolve(result);
				}
			});
		});

	return deferred.promise;
}

function runQuery(viewIds, metrics, dimensions, filters, extra) {
	var deferred = q.defer();
	dimensions = dimensions || [];
	dimensions = JSON.parse(JSON.stringify(dimensions)); // make a copy
	dimensions.push('date');
	dimensions.push('hour');
	extra = extra || {};

	config = require('../../config/config.json');
	setTimeout(function () {
		api.authenticate()
			.then(function (authClient) {
				var params = {
					'auth': authClient,
					'ids': 'ga:' + viewIds,
					'metrics': prepareQueryParam(metrics),
					'dimensions': prepareQueryParam(dimensions),
					'startIndex': extra.startIndex || 1,
					'max-results': extra.maxResults || 10000,
					'start-date': extra.start || config.settings.timeSpan + 'daysAgo',
					'end-date': extra.end || 'today'
				};
				if (filters) {
					params.filters = filters;
				}
				analytics.data.ga.get(params, function (err, result) {
					if (err) {
						logger.error('runQuery', {
							metrics: metrics,
							dimensions: dimensions,
							filters: filters,
							error: err
						});
						deferred.reject(err);
					} else {
						logger.info('runQuery', {
							metrics: metrics,
							dimensions: dimensions,
							filters: filters,
							results: result.rows ? result.rows.length : 0
						});
						deferred.resolve(result);
					}
				});
			});
	}, extra.timeout || 0);

	return deferred.promise;
}

module.exports = {
	getProfiles: getProfiles,
	runQuery: runQuery
};
