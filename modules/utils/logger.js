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