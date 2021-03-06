/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global afterEach, beforeEach, describe, expect, it, require, spyOn*/
describe('Parser test cases:', function() {
	var data,
		mocks = {
			profiles: {
				get: noop
			},
			seer: {
				predict: noop
			},
			strainer: {
				filter: noop
			}
		};

	beforeEach(function () {
		mockery.registerMock('api/profiles', mocks.profiles);
		mockery.registerMock('data/seer', mocks.seer);
		mockery.registerMock('data/strainer', mocks.strainer);

		data = {
			query: {
				ids: '1234',
				metrics: [ 'totalEvents' ]
			},
			rows: [
				[ 'event', '20151105', '09', '43242' ]
			]
		}
	});

	afterEach(function () {
		mockery.deregisterMock('api/profiles');
		mockery.deregisterMock('data/seer');
		mockery.deregisterMock('data/strainer');
	});

	it('Use seer and strainer to parse data', function() {
		var parser = require('data/parser');
		spyOn(mocks.seer, 'predict');
		spyOn(mocks.strainer, 'filter').and.returnValue(data.rows);

		parser.parse(data, {});

		expect(mocks.seer.predict).toHaveBeenCalled();
		expect(mocks.strainer.filter).toHaveBeenCalled();
	});

	it('Parse GA date to date object', function() {
		var parser = require('data/parser'),
			result;
		spyOn(mocks.seer, 'predict');
		spyOn(mocks.strainer, 'filter').and.returnValue(data.rows);

		result = parser.parse(data, {});

		expect(result.data[0].date).toEqual('2015-11-05T09:00:00+00:00');
	});
});
