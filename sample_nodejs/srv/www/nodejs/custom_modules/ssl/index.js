/*
	Umbrella SSL for node servers
*/

var fs = require ('fs');
var httpsOptions = {
	key: fs.readFileSync (__dirname + '/ssl/localhost.key', 'utf8'),
	cert: fs.readFileSync (__dirname + '/ssl/localhost.crt', 'utf8')//,
	//ca: fs.readFileSync (__dirname + '/ssl/localhost.CA.crt', 'utf8')
};
var exports = module.exports;

exports.ssl = httpsOptions;

