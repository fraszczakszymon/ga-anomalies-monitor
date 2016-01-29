/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module*/
function filter(rows) {
	var i,
		newRows = [],
		valuePosition = rows[0].length - 1,
		valuesToSkip = 1;

	for (i = rows.length - 1; i >= 0; i--, valuesToSkip++) {
		if (rows[i][valuePosition] !== '0') {
			break;
		}
	}
	for (i = 0; i < rows.length - valuesToSkip; i++) {
		newRows.push(rows[i]);
	}

	return newRows;
}

module.exports = {
	filter: filter
};