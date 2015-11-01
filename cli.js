/*global require*/
'use strict';
require('app-module-path').addPath(__dirname + '/modules');
var analytics = require('api/analytics'),
	config = require('./config/config.json');

//analytics.getProfiles()
//	.done(function (result) {
//		result.items.forEach(function (item) {
//			console.log(item.id, "\t", item.name);
//		});
//	});

config.queries.forEach(function (query) {
	analytics.runQuery(query.viewIds, query.metrics, query.dimensions, query.filters)
		.then(function (result) {
			console.log(result);
		}, function (err) {
			console.log(err);
		});
	analytics.getPageViews(query.viewIds)
		.then(function (result) {
			console.log(result);
		}, function (err) {
			console.log(err);
		});
});
