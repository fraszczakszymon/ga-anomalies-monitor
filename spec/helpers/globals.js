/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global afterEach, beforeEach, global*/
global['mockery'] = require('mockery');
global['noop'] = function () {};
global['runCallback'] = function (callback) {
	callback();
};
global['deferred'] = {
	promise: {
		then: noop,
		done: noop,
		fail: noop
	},
	reject: noop,
	resolve: noop
};
global['q'] = {
	defer: function () {
		return deferred;
	}
};

mockery.registerMock('utils/logger', {
	info: noop,
	error: noop
});

beforeEach(function () {
	mockery.enable({
		warnOnReplace: false,
		warnOnUnregistered: false
	});
});

afterEach(function () {
	mockery.disable();
});