/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global beforeEach, describe, expect, it, require*/
describe('API test cases:', function() {
	var authorizeSuccess,
		mocks = {
			google: {
				auth: {
					JWT: function () {
						this.authorize = function (callback) {
							callback(!authorizeSuccess);
						}
					}
				}
			}
		};

	beforeEach(function () {
		authorizeSuccess = true;
		mockery.registerMock('googleapis', mocks.google);
		mockery.registerMock('q', q);
	});

	it('Resolve on authorization success.', function() {
		var api = require('api/api');
		spyOn(deferred, 'resolve');

		api.authenticate();
		expect(deferred.resolve).toHaveBeenCalled();
	});

	it('Reject on authorization failure.', function() {
		var api = require('api/api');
		spyOn(deferred, 'reject');

		authorizeSuccess = false;
		api.authenticate();
		expect(deferred.reject).toHaveBeenCalled();
	});
});
