/**
 * GA Anomalies Monitor (https://github.com/fraszczakszymon/ga-anomalies-monitor)
 *
 * Copyright © 2016 Frąszczak Szymon. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/*global module, require*/
var winston = require('winston'),
	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.File)({
				name: 'info-file',
				filename: './logs/info.log',
				level: 'info'
			}),
			new (winston.transports.File)({
				name: 'error-file',
				filename: './logs/error.log',
				level: 'error'
			})
		]
	});

logger.remove(winston.transports.Console);
logger.add(winston.transports.Console, {
	colorize: true,
	prettyPrint: true
});

module.exports = logger;