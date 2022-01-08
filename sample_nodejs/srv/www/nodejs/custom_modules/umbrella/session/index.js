/*
	Umbrella session handling
*/

var sessions = require ('client-sessions');
var crypto = require ('crypto');
var randomId = function () {
	return crypto.randomBytes (20).toString ('hex');
};

var exports = module.exports;

var timeout = {
	year: 256 * 24 * 60 * 60 * 1000, // 1 year
	sixMonths: 256 * 12 * 60 * 60 * 1000 // 6 months
};

var security = true;

exports.session = sessions ({
	cookieName: 'session',
	secret: randomId (),
	duration: timeout.year,
	activeDuration: timeout.sixMonths,
	cookie: {
		httpOnly: security,
		secure: security,
		ephemeral: security
	}
});

exports.makeSession = function (secret, duration, activeDuration, secure) {
	if (typeof (secret) === 'undefined' || secret == '') {
		secret = randomId ();
	}
	if (typeof (duration) === 'undefined' || duration == '' || duration <= 0) {
		duration = timeout.year;
	}
	if (typeof (activeDuration) === 'undefined' || activeDuration == '' || activeDuration <= 0) {
		activeDuration = timeout.sixMonths;
	}
	if (typeof (secure) === 'undefined' || typeof (secure) !== 'boolean') {
		secure = security;
	}
	exports.session = sessions ({
		cookieName: 'session',
		secret: secret,
		duration: duration,
		activeDuration: activeDuration,
		cookie: {
			httpOnly: secure,
			secure: secure,
			ephemeral: secure
		}
	});
	return exports.session;
};
