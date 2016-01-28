/*global module, require*/
var database = require('storage/database'),
	express = require('express'),
	moment = require('moment-timezone'),
	provider = require('data/provider'),
	router = express.Router();

router.get('/:id?', function (req, res) {
	var builds = database.getBuildsRepository();

	builds
		.get(req.params.id)
		.then(function (build) {
			if (!build) {
				res.status(404);
			}

			res.json({
				id: build.id,
				date: build.date,
				duration: build.duration,
				status: build.status,
				queries: JSON.parse(build.data)
			});
		}, function (err) {
			res.status(404);
		});
});

router.post('/', function (req, res) {
	var builds = database.getBuildsRepository(),
		duration,
		startTime = moment();

	builds
		.create()
		.then(function (build) {
			provider
				.get()
				.then(function (data) {
					duration = moment.duration(moment().diff(startTime));
					builds.update(build.id, data, duration.asMilliseconds(), builds.STATUS.done);
				}, function () {
					duration = moment.duration(moment().diff(startTime));
					builds.update(build.id, '', duration.asMilliseconds(), builds.STATUS.error);
				});

			res.json(build);
		}, function (error) {
			res.status(400).json(error);
		});
});

module.exports = router;