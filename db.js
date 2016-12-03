var mysql = require('mysql');
var dbconfig = require('./config/.database.js');
var dbconnection = mysql.createConnection(dbconfig.connection);

module.exports = dbconnection;