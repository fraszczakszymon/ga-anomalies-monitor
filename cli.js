/*global process, require*/
require('app-module-path').addPath(__dirname + '/modules');
var analytics = require('api/analytics'),
	app = require('./package.json'),
	config = require('./config/config.json'),
	program = require('commander');

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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
