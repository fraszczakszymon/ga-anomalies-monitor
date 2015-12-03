/*global module, require*/
var analytics = require('api/analytics'),
	profiles = {};

function fetch() {
	return analytics.getProfiles()
		.then(function (result) {
			result.items = result.items || [];
			result.items.forEach(function (item) {
				profiles['ga:' + item.id] = item;
			});
		});
}

function get(id) {
	return profiles[id];
}

module.exports = {
	get: get,
	fetch: fetch
};
