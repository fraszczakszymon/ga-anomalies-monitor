/*global beforeEach, describe, expect, it, require*/
describe('Strainer test cases:', function() {
	var rows;

	beforeEach(function () {
		rows = [
			[ '5' ],
			[ '3' ],
			[ '0' ],
			[ '2' ],
			[ '0' ],
			[ '0' ]
		]
	});

	it('Filter out all zeros at the end and one more value', function() {
		var strainer = require('data/strainer');

		expect(strainer.filter(rows).length).toEqual(3);
	});
});
