/*
	Dice Services generic scripts that are used all over
*/

var exports = module.exports;

exports.utf = 'utf8';
exports.utf8 = 'UTF-8';
exports.charset = '; charset=' + exports.utf8;

exports.createUID = function () {
	function s4 () {
		return Math.floor ((1 + Math.random ()) * 0x10000).toString (16).substring (1);
	}
	return s4 () + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + s4 () + s4 ();
};

exports.isPortTaken = function (port, fn) {

	var tester = require ('net').createServer ();

	tester.once ('error', function (err) {
		if (err.code != 'EADDRINUSE') {
			return fn (err);
			//console.log (err.code);
		}
		fn (null, true, port);
	});

	tester.once ('listening', function () {
		tester.once ('close', function () {
			fn (null, false, port);
		}).close ();
	});

	tester.listen (port);

}