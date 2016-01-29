/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

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
