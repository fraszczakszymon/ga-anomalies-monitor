/*global require*/
require('app-module-path').addPath(__dirname + '/modules');
require('app-module-path').addPath(__dirname + '/controllers');
var app,
	config = require('./config/config.json'),
	controllers = require('controllers'),
	cors = require('cors'),
	database = require('storage/database'),
	express = require('express'),
	logger = require('utils/logger');

database.init();

app = express();
app.use(cors());
app.use(controllers);

app.listen(config.server.port, function () {
	logger.info('Example app listening at http://localhost:' + config.server.port);
});
