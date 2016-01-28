/*global module, require*/
var express = require('express'),
	router = express.Router();

router.use('/build', require('controllers/build'));

module.exports = router;