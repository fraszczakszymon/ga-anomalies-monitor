/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global process, require*/
require('app-module-path').addPath(__dirname + '/modules');
var analytics = require('api/analytics'),
	app = require('./package.json'),
	config = require('./config/config.json'),
	program = require('commander'),
	calculator = require('data/calculator');

program.version(app.version);

program
	.command('profiles')
	.description('Get all available GA profiles')
	.action(function () {
		analytics
			.getProfiles()
			.done(function (result) {
				result.items.forEach(function (item) {
					console.log("id:", item.id, "• timezone:", item.timezone, "• name:", item.name);
				});
			});
	});

program
	.command('queries')
	.description('Test configured queries')
	.action(function () {
		config.queries.forEach(function (query) {
			analytics.runQuery(query.viewIds, query.metrics, query.dimensions, query.filters);
		});
	});

program
	.command('parameters')
	.description('Calculate best parameters for healthy query data')
	.arguments('<queryId>')
	.action(function (queryId) {
		var query = config.queries[queryId];
		if (!query) {
			console.log('Given query does not exist.');
			return;
		}

		calculator.calculate(query)
			.then(function (values) {
				console.log('alpha:', values[0], 'beta:', values[1]);
			});
	});


program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
