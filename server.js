/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

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
