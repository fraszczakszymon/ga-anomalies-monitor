/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

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
