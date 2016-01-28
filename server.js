/*global require*/
require('app-module-path').addPath(__dirname + '/modules');
require('app-module-path').addPath(__dirname + '/controllers');
var app,
	config = require('./config/config.json'),
	cors = require('cors'),
	database = require('storage/database'),
	express = require('express'),
	logger = require('utils/logger'),
	routes = require('controllers/routes');

database.init();

app = express();
app.use(cors());
app.use(routes);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/front/index.html');
});

app.use('/public', express.static('./front/public'));

app.listen(config.server.port, function () {
	logger.info('Example app listening at http://localhost:' + config.server.port);
});
