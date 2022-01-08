'use strict';

const dotenv = require ('dotenv');
dotenv.config ();

if (process.env.ROOT_DIR != '') {
	process.env.PWD = process.env.ROOT_DIR;
}

const __JSON = JSON;
JSON = {
	stringify: __JSON.stringify,
	parse: __JSON.parse,
	encode: __JSON.stringify,
	decode: __JSON.parse
};

// GENERIC INITS
//
const uploadLimit = /* bytes */ 1024 * /* KB */ 1024 * /* MB */ 1 // 1024  * /* GB */ 1; // this is how we set sizes
const utf = 'utf8'; // use this encoding for reading files
const utf_8 = 'utf-8'; // use this encoding for headers
const charset = '; charset=' + utf_8; // append this to content-type header
const oneDay = 1000 * 60 * 60 * 24; // one day in milliseconds

const domain = process.env.DOMAIN;

const root_dir = process.env.PWD;
const app_dir = root_dir + '/html';
const data_dir = root_dir + '/data';
const logs_dir = root_dir + '/logs';

const fs = require ('fs');
const URL = require ('url');
const tls = require ('tls');
const http = require ('http');
const https = require ('https');
const Busboy = require ('busboy');
const crypto = require ('crypto');
const querystring = require ('querystring');
const exec = require ('child_process').exec;

const Web3 = require ('web3');
const utils = require ('ethereumjs-util');
const web3 = new Web3 (new Web3.providers.HttpProvider (process.env.RPC_URL));

const CORE = require ('umbrella');
const IO = CORE.io;
IO.encoding (false);
const ReadFromFile = IO.ReadFromFile;
const post = CORE.post ({
	logging: true,
	logDir: logs_dir + '/requests',
	uploadLimit: uploadLimit
});
const api = CORE.api ({
	uploadLimit: uploadLimit
});

let tempSecureContext = {};
tempSecureContext [domain] = tls.createSecureContext ({
	key: fs.readFileSync (root_dir + '/ssl/' + domain + '.privkey.pem', utf),
	cert: fs.readFileSync (root_dir + '/ssl/' + domain + '.fullchain.pem', utf)
});
const secureContext = tempSecureContext;

const httpsOptions = {
	SNICallback: function (domainName, callback) {
		if (secureContext [domainName]) {
			callback (null, secureContext [domain]);
		}
		else if (domainName.endsWith (domain)) {
			callback (null, secureContext [domain]);
		}
		else {
			callback (null, secureContext [domain]);
		}
	},
	key: fs.readFileSync (root_dir + '/ssl/' + domain + '.privkey.pem', utf),
	cert: fs.readFileSync (root_dir + '/ssl/' + domain + '.fullchain.pem', utf)
};

let lastCheckedBlock = parseInt (fs.readFileSync (data_dir + '/lastCheckedBlock', utf).trim ());
let currentBlock = 0;

let awaitingTransactions = JSON.decode (fs.readFileSync (data_dir + '/awaitingTransactions.json'));
const updateAwaitingTransactions = function () {
	fs.writeFileSync (data_dir + '/awaitingTransactions.json', JSON.encode (awaitingTransactions));
};
const updateLastCheckedBlock = function () {
	fs.writeFileSync (data_dir + '/lastCheckedBlock', lastCheckedBlock.toString ());
};
const addAwaitingTransaction = function (data) {
	data.from = data.from.toLowerCase ();
	if (!(data.from in awaitingTransactions)) {
		awaitingTransactions [data.from] = [];
	}
	awaitingTransactions [data.from].push (data);
	updateAwaitingTransactions ();
};
let blankRequest = {connection:{destroy:console.log}};
let blankResponse = {writeHead:console.log,end:console.log};
/*
	sample transaction -->> {
		from: 0x00,
		to: 0x00,
		data: 0x00,
		invoice: 0,
		invoiceItem: 0
	}
*/
// leaving this as a sample to show how to do a quick and dirty transaction checking
const checkAwaitingTransactions = function () {
	if (lastCheckedBlock < currentBlock) {
		console.log ('checking block', lastCheckedBlock);
		web3.eth.getBlock (lastCheckedBlock, true).then (function (block) {
			block.transactions.forEach (function (transaction) {
				// check for key existance
				transaction.from = transaction.from.toLowerCase ();
				if (transaction.from in awaitingTransactions) {
					// address is on our watch list
					let targets = awaitingTransactions [transaction.from];
					for (let i = 0, l = targets.length; i < l; i++) {
						let target = targets [i];
// 						console.log ('debug', transaction, target);
						if (transaction.to != null && target.to.toLowerCase () == transaction.to.toLowerCase () && target.data.toLowerCase () && transaction.input.toLowerCase ()) {
							// we have a match, time to get receipt
							(function (transaction, target, index) {
								web3.eth.getTransactionReceipt (transaction.hash).then (function (receipt) {
									if (receipt.status) {
										console.log ('found one', transaction.hash);
										updateAwaitingTransactions ();
									}
								});
							}) (transaction, target, i);
						}
					}
				}
			});
			lastCheckedBlock++;
			updateLastCheckedBlock ();
			checkAwaitingTransactions ();
		});
	} else {
		setTimeout (function () {
			getBlockNumber ();
		}, 1000);
	}
};
const getBlockNumber = function () {
	web3.eth.getBlockNumber ().then (function (blockNumber) {
		currentBlock = blockNumber;
		checkAwaitingTransactions ();
	});
};
getBlockNumber ();

const getHeaders = function (additionalHeaders) {
	let h = {
		'Content-Type': 'application/json' + charset,
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
		'Access-Control-Allow-Headers': 'content-type, *',
		'Access-Control-Expose-Headers': '*',
		'Access-Control-Allow-Credentials': 'true'
	};
	if (typeof (additionalHeaders) === 'object') {
		Object.keys (additionalHeaders).map (function (objectKey, index) {
			h [objectKey] = additionalHeaders [objectKey];
		});
	}
	return h;
};

const AllowAccess = function (requestHeaders) {
	let ah = {};
	if (typeof (requestHeaders.origin) !== 'undefined') {
		if (requestHeaders.origin == null || requestHeaders.origin == 'null') {
			requestHeaders.origin = '*';
		}
		ah ['Access-Control-Allow-Origin'] = requestHeaders.origin;
	}
	if (typeof (requestHeaders ['access-control-request-headers']) !== 'undefined') {
		ah ['Access-Control-Allow-Headers'] = requestHeaders ['access-control-request-headers'] + ', set-cookie, cookie, session-cookie, set-session-cookie, *';
	}
	return getHeaders (ah);
};

const getExtension = function (filename) {
	let extension = filename.toLowerCase ().split ('.').slice (-1).pop ();
	if (extension in IO.contentTypeMap) {
		return extension;
	}
	else {
		return 'bin';
	}
};

const getMimeType = function (filename) {
	let extension = getExtension (filename);
	return IO.MIME (extension).contentType.split ('/') [0];
};

const ForceSSL = function (request, response) {
	if (typeof (request.headers.host) === 'undefined') {
		request.headers.host = domain;
	}
	response.writeHead (301, 'Moved Permanently', {
		'Location': 'https://' + request.headers.host + request.url
	});
	response.end ();
};

const RemoveWWW = function (request, response) {
	request.headers.host = request.headers.host.replace ('www.', '');
	response.writeHead (301, 'Moved Permanently', {
		'Location': 'https://' + request.headers.host + request.url
	});
	response.end ();
};

const removeX = function (input) {
	if (input.startsWith ('0x')) {
		return input.substring (2);
	}
	else {
		return input;
	}
};

const emptyHex = /^(0x){0,1}0{1,}$/gi;
const isSignature = /^(0x){0,1}[0-9a-f]{130}$/gi;
const isNumber = /^\d+$/gi;
const isHash = /^(0x){0,1}[0-9a-f]{64}$/gi;
const isWallet = /^(0x){0,1}[0-9a-f]{40}$/gi;

const ApiLogic = function (request, response) {
    console.log ('apilogic', request.url);
    response.writeHead (200, 'OK', AllowAccess (request.headers));
    response.end (JSON.encode ({success: true, debug: 'Looks like api works'}), utf_8);
};

const ServerLogic = function (request, response) {
	if (typeof (request.headers.host) === 'undefined') {
		request.headers.host = domain;
	}
	request.headers.host = request.headers.host.split (':') [0];
	if (request.headers.host.substr (0, 4) == 'www.') {
		RemoveWWW (request, response);
	}
	else {
		if (request.url.startsWith ('/api/')) {
            request.url = request.url.substr (4);
			ApiLogic (request, response);
		}
		else {
            ReadFromFile (request, response, app_dir + request.url, AllowAccess (request.headers));
		}
	}
};

const httpServer = http.createServer (ForceSSL);
httpServer.listen (process.env.HTTP_PORT); // http
console.log ('HTTP Server running at http://127.0.0.1:' + process.env.HTTP_PORT + '/');
const httpsServer = https.createServer (httpsOptions, ServerLogic);
httpsServer.addContext ('payload.' + domain, secureContext [domain]);
httpsServer.addContext ('*.' + domain, secureContext [domain]);
httpsServer.addContext (domain, secureContext [domain]);
httpsServer.listen (process.env.HTTPS_PORT); // https
console.log ('HTTPS Server running at https://127.0.0.1:' + process.env.HTTPS_PORT + '/');
