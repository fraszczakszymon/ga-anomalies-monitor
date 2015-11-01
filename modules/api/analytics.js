/*global module, require*/
var api = require('api/api'),
	analytics = require('googleapis').analytics('v3'),
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
					deferred.reject(err);
				} else {
					deferred.resolve(result);
				}
			});
		});

	return deferred.promise;
}

function runQuery(viewIds, metrics, dimensions, filters, startIndex) {
	var deferred = q.defer();
	dimensions = dimensions = [];
	dimensions.push('date');
	dimensions.push('hour');
	api.authenticate()
		.then(function (authClient) {
			var params = {
				'auth': authClient,
				'ids': prepareQueryParam(viewIds),
				'metrics': prepareQueryParam(metrics),
				'dimensions': prepareQueryParam(dimensions),
				'startIndex': startIndex || 1,
				'max-results': 10000,
				'start-date': '7daysAgo',
				'end-date': 'today'
			};
			if (filters) {
				params.filters = filters;
			}
			analytics.data.ga.get(params, function (err, result) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(result);
				}
			});
		});

	return deferred.promise;
}

function getPageViews(viewIds) {
	return runQuery(viewIds, [ 'pageviews' ]);
}

module.exports = {
	getPageViews: getPageViews,
	getProfiles: getProfiles,
	runQuery: runQuery
};
