/*global beforeEach, describe, expect, it, require*/
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
		spyOn(mocks.strainer, 'filter').and.returnValue([]);

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

		expect(result.data.real[0].date.toISOString()).toEqual('2015-11-05T09:00:00.000Z');
	});
});
