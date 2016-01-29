/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var q = require('q'),
	JWT = require('googleapis').auth.JWT,
	logger = require('utils/logger'),
	credentials = require('../../config/credentials.json'),
	authClient = new JWT(
		credentials.accountEmail,
		credentials.accountKey,
		null,
		['https://www.googleapis.com/auth/analytics.readonly']
	);

function authenticate() {
	var deferred = q.defer();
	authClient.authorize(function (err) {
		if (err) {
			logger.error('authenticate');
			deferred.reject(err);
		} else {
			deferred.resolve(authClient);
		}
	});

	return deferred.promise;
}

module.exports = {
	authenticate: authenticate
};