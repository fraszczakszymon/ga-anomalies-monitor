/*global require*/
require('app-module-path').addPath(__dirname + '/modules');
var express = require('express'),
	app = express(),
	config = require('./config/config.json'),
	dataProvider = require('data/dataProvider'),
	logger = require('utils/logger');

app.get('/events', function (req, res) {
	var data = dataProvider.get();

	res.json(data);
});

app.listen(config.server.port, function () {
	logger.info('Example app listening at http://localhost:' + config.server.port);
});