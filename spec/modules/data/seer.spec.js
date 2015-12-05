/*global beforeEach, describe, expect, it, require*/
describe('Seer test cases:', function() {
	var collection,
		mocks = {
			query: {}
		};

	beforeEach(function () {
		var data = [ 17, 21, 23, 26, 23, 29 ];
		collection = {
			data: []
		};
		data.forEach(function (value) {
			collection.data.push({
				date: 'foo',
				value: value
			});
		});
		mocks.query = {
			alpha: 0.95,
			beta: 0.13,
			threshold: 0.4
		}
	});

	it('Calculate forecast', function() {
		var seer = require('data/seer'),
			expectedForecast = [ 17, 21, 25, 27, 30, 26 ];

		seer.predict(collection, mocks.query);

		for (var i = 0; i < 6; i++) {
			expect(collection.data[i].forecast).toEqual(expectedForecast[i]);
		}
	});

	it('Calculate error', function() {
		var seer = require('data/seer');

		seer.predict(collection, mocks.query);

		for (var i = 2; i < 6; i++) {
			expect(collection.data[i].error).not.toEqual(0);
		}
	});

	it('Mark forecast when real value exceeds over given threshold', function() {
		var seer = require('data/seer');
		mocks.query.threshold = 0.15;

		seer.predict(collection, mocks.query);

		expect(collection.data[4].exceeded).toBeTruthy();
	});
});
