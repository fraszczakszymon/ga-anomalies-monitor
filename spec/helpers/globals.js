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

beforeEach(function () {
	mockery.enable({
		warnOnReplace: false,
		warnOnUnregistered: false
	});
});

afterEach(function () {
	mockery.disable();
});