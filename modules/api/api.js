/*global module, require*/
var q = require('q'),
	JWT = require('googleapis').auth.JWT,
	credentials = require('../../config/credentials.json'),
	auth,
	authClient = new JWT(
		credentials.accountEmail,
		credentials.accountKey,
		null,
		[ 'https://www.googleapis.com/auth/analytics.readonly' ]
	);

function authenticate (forceLogin) {
	var deferred = q.defer();
	if (auth && !forceLogin) {
		deferred.resolve(auth);
	} else {
		authClient.authorize(function(err) {
			if (err) {
				deferred.reject(err);
			} else {
				auth = authClient;
				deferred.resolve(auth);
			}
		});
	}

	return deferred.promise;
}

module.exports = {
	authenticate: authenticate
};