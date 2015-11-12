/*global module*/

function filter(rows) {
	var i,
		newRows = [],
		valuePosition = rows[0].length - 1,
		valuesToSkip = 1;

	for (i = rows.length-1; i >= 0; i--, valuesToSkip++) {
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