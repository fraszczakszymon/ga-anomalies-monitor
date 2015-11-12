/*global beforeEach, describe, expect, it, require*/
describe('Seer test cases:', function() {
	var collection;

	beforeEach(function () {
		var data = [ 17, 21, 23, 26, 23, 29 ];
		collection = {
			data: {
				real: [ ]
			}
		};
		data.forEach(function (value) {
			collection.data.real.push({
				date: 'foo',
				value: value
			});
		});
	});

	it('Calculate forecast', function() {
		var seer = require('data/seer'),
			expectedForecast = [ 17, 21, 25, 27, 30, 26 ];

		seer.predict(collection);

		for (var i = 0; i < 6; i++) {
			expect(collection.data.forecast[i].value.forecast).toEqual(expectedForecast[i]);
		}
	});

	it('Calculate forecast', function() {
		var seer = require('data/seer');

		seer.predict(collection);

		for (var i = 2; i < 6; i++) {
			expect(collection.data.forecast[i].error).not.toEqual(0);
		}
	});

	it('Mark forecast when real value exceeds over given threshold', function() {
		var seer = require('data/seer');

		seer.predict(collection);

		expect(collection.data.forecast[4].exceeded).toBeTruthy();
	});
});
