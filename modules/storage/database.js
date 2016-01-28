/*global module, require*/
var db,
	buildsRepository = require('storage/buildsRepository'),
	file = "./database/ga_data.db",
	sqlite3 = require("sqlite3").verbose();

function init() {
	db = new sqlite3.Database(file);

	db.serialize(function () {
		db.run("CREATE TABLE IF NOT EXISTS builds (" +
			"id INTEGER PRIMARY KEY AUTOINCREMENT," +
			"date TEXT," +
			"data TEXT," +
			"duration REAL," +
			"status INTEGER" +
		");");
	});
}

function getBuildsRepository() {
	return buildsRepository.getInstance(db);
}

module.exports = {
	init: init,
	getBuildsRepository: getBuildsRepository
};