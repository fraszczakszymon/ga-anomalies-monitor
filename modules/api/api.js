/*global module, require*/
var q = require('q'),
	JWT = require('googleapis').auth.JWT,
	logger = require('utils/logger'),
	credentials = require('../../config/credentials.json'),
	authClient = new JWT(
		credentials.accountEmail,
		credentials.accountKey,
		null,
		[ 'https://www.googleapis.com/auth/analytics.readonly' ]
	);

function authenticate () {
	var deferred = q.defer();
	authClient.authorize(function(err) {
		if (err) {
			logger.error('Authentication failure.');
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