/*
	Umbrella POST handling
*/

var fs = require ('fs');

var exports = module.exports;
var logging = false;
var logDir = '';
var uploadLimit = 1024 * 1024 * 1; // 1Mb
var ip4filter = /^[\:]{2}[f]{4}[\:]{1}/i;

exports.create = function (config) {
	if (typeof (config) !== 'undefined') {
		if (config.logging) {
			if (typeof (config.logDir) !== 'undefined' && config.logDir != '') {
				logging = config.logging;
				logDir = config.logDir;
			}
		}
		if (typeof (config.uploadLimit) !== 'undefined') {
			uploadLimit = config.uploadLimit;
		}
	}
};

exports.process = function (request, response, callback) {
	if (typeof (request.fullUrl) !== 'undefined' && request.fullUrl != null) {
		request.url = request.fullUrl;
	}
	let totalSize = 0;
	let chunks = [];
	let threw = false;
	if (typeof (callback) !== 'function') {
		throw new Error ('missing callback function');
	}
	request.on ('data', function (chunk) {
		chunks.push (chunk);
		totalSize += Buffer.byteLength (chunk);
		if (totalSize > uploadLimit) {
			threw = true;
			request.post = null;
			response.writeHead (413, 'Payload Too Large', getHeaders ({'Content-Type': 'text/plain' + charset}));
			response.end ();
			request.connection.destroy ();
			callback ();
		}
	});
	request.on ('end', function () {
		if (!threw) {
			if (logging) {
				// ** REQUEST LOGGING ** //
				var IP = request.connection.remoteAddress.replace (ip4filter, '');
				var date = new Date ().toISOString ().replace ('T', ' ').substr (0, 19);
				var logData = {
					ip: IP,
					date: date,
					request: {
						method: request.method,
						url: request.oldUrl,
						apiUrl: request.url,
						headers: request.headers,
						remoteAddress: request.connection.remoteAddress,
						remotePort: request.connection.remotePort,
						data: Buffer.concat (chunks).toString ()
					}
				};
				fs.appendFile (logDir + '/' + IP + '.log', JSON.stringify (logData) + "\n", function (err) {
					request.post = Buffer.concat (chunks);
					callback ();
				});
				// ** END REQUEST LOGGING ** //
			}
			else {
				request.post = Buffer.concat (chunks);
				callback ();
			}
		}
	});
};
