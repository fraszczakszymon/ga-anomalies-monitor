/*global module, require*/
var api = require('api/api'),
	analytics = require('googleapis').analytics('v3'),
	logger = require('utils/logger'),
	q = require('q');

function prepareQueryParam (params) {
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
	var config = require('../../config/config.json'),
		deferred = q.defer();
	dimensions = dimensions || [];
	dimensions = JSON.parse(JSON.stringify(dimensions)); // make a copy
	dimensions.push('date');
	dimensions.push('hour');
	extra = extra || {};
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

	return deferred.promise;
}

module.exports = {
	getProfiles: getProfiles,
	runQuery: runQuery
};
