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
					console.log(item.id, "\t", item.name);
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
