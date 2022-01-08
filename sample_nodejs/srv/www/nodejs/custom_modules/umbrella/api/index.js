/*
	Umbrella API functions
*/

var URL = require ('url');
var http = require ('http');
var https = require ('https');

var exports = module.exports;

var uploadLimit = 10e6;

var contentType = 'application/json; charset=utf-8';
var acceptContentType = 'application/json; charset=utf-8';

exports.create = function (config) {
	if (typeof (config) !== 'undefined') {
		if (typeof (config.uploadLimit) !== 'undefined') {
			uploadLimit = config.uploadLimit;
		}
		if (typeof (config.contentType) !== 'undefined') {
			contentType = config.contentType;
		}
		if (typeof (config.acceptContentType) !== 'undefined') {
			acceptContentType = config.acceptContentType;
		}
	}
};

var call = function (request, response, apiParams, callback) {
	apiParams.url = URL.parse (apiParams.url);
	if (typeof apiParams.port === 'undefined') {
		if (apiParams.url.protocol == 'http:') {
			apiParams.port = '80';
			apiParams.secure = false;
		} else {
			apiParams.port = '443';
			apiParams.secure = true;
		}
	}
	if (typeof (apiParams.secure) === 'undefined') {
		apiParams.secure = false;
	}

	var sendContentType = (typeof (apiParams.contentType) !== 'undefined' ? apiParams.contentType : contentType);

	// An object of options to indicate where to post to
	var postOptions = {
		hostname: apiParams.url.host,
		port: apiParams.port,
		path: apiParams.url.path.replace (/\/\//g, '/'), // removes all double forward slashes
		method: apiParams.method,
		headers: {
			'Content-Type': sendContentType,
			'Accept': acceptContentType
		}
	};
	// allow for custom Certificate Authority
	if (typeof (apiParams.ca) !== 'undefined') {
		postOptions.ca = apiParams.ca;
	}
	// user and dealer need to be added in under headers in apiParams
	if (typeof (apiParams.headers) !== 'undefined') {
		// include extra custom headers
		Object.keys (apiParams.headers).forEach (function (key, index) {
			// add by key to headers
			var value = apiParams.headers [key];
			if (typeof (value) !== 'undefined' && value != '') {
				postOptions.headers [key] = value;
			}
		});
	}
	if (typeof apiParams.data !== 'undefined' && apiParams.data != null && apiParams.data != '') {
		postOptions.headers['Content-Length'] = Buffer.byteLength(apiParams.data, 'utf8');
	}
	if (typeof apiParams.authentication !== 'undefined' && apiParams.authentication != null && apiParams.authentication) {
		postOptions.headers['Authorization'] = apiParams.auth;
	}

	var parseResponse = function (postResponse) {
		response.apiResponse = {
			json: {}
		};
		response.apiResponse.headers = postResponse.headers;
		var jsonString = '';
// 		console.log ('STATUS: ' + postResponse.statusCode);
// 		console.log (postResponse.url);
// 		console.log ('HEADERS: ' + JSON.stringify(postResponse.headers));
		postResponse.setEncoding ('utf8');
		postResponse.on ('data', function (chunk) {
			//console.log ('Response: ' + chunk + "\n\n");
			jsonString += chunk;
			if (jsonString.length > uploadLimit) {
				jsonString = '';
				console.log ('BAILING HERE @@@ !!!');
				response.writeHead (413, {'Content-Type': contentType});
				response.end ('{"error":"File too large!"}');
				request.connection.destroy ();
			}
		});
		postResponse.on ('end', function () {
// 			console.log ("\n\n" + '################ RESPONSE ################' + "\n");
// 			console.log (jsonString);
// 			console.log ("\n" + '############## END RESPONSE ##############' + "\n\n");
			response.apiResponse.status = postResponse.statusCode;
			response.apiResponse.raw = jsonString;
			response.apiResponse.json = null;
			if (jsonString != '') {
				try {
					response.apiResponse.json = JSON.parse (jsonString);
				} catch (e) {
					// something does not parse
// 					console.log ('FAILED PARSING JSON STRING @@@@@@@@**********######');
// 					console.log (e);
				}
			}
			callback ();
		});
	};

	// Set up the request
	if (!apiParams.secure) {
		var postRequest = http.request (postOptions, parseResponse);
	} else {
		var postRequest = https.request (postOptions, parseResponse);
	}

	// post the data
	if (typeof apiParams.data !== 'undefined' && apiParams.data != null && apiParams.data != '') {
		postRequest.write (apiParams.data);
	}

	postRequest.end ();

};
exports.call = call;

exports.authCall = function (request, response, apiParams, auth, callback) {
	if (typeof (apiParams.headers) === 'undefined') {
		apiParams.headers = {};
	}
	if (typeof (auth.authorization) !== 'undefined') {
		apiParams.headers ['API-Authorization'] = auth.authorization;
	}
	if (typeof (auth.session) !== 'undefined') {
		apiParams.headers ['API-Session'] = auth.session;
	}
	call (request, response, apiParams, callback);
};
