/*global require*/
require('app-module-path').addPath(__dirname + '/modules');
var express = require('express'),
	cors = require('cors'),
	app = express(),
	config = require('./config/config.json'),
	provider = require('data/provider'),
	logger = require('utils/logger');

app.use(cors());
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/front/index.html');

});
app.use('/public', express.static('./front/public'));
app.get('/queries', function (req, res) {
	provider
		.get()
		.then(function (data) {
			res.json(data);
		}, function (error) {
			res.status(error.code).json(error);
		});

});

app.listen(config.server.port, function () {
	logger.info('Example app listening at http://localhost:' + config.server.port);
});
