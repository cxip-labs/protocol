/*
	All of the generic functions for Umbrella App Servers
*/

// we changed this because it was not referencing properly
// var MODULE_NAME = 'umbrella';
var MODULE_NAME = '.';

var exports = module.exports;

var SESSION = require (MODULE_NAME + '/session');
// gives standard session object
exports.session = SESSION.session;
// function that returns custom session object
// vars in function - (secret, duration, activeDuration)
// secret is the secret key for session cookie encryption
// duration in miliseconds for keeping cookie for
// duration in miliseconds for marking cookie as active for
exports.makeSession = SESSION.makeSession;

var MEMCACHE = require (MODULE_NAME + '/server-session');
// gives server-side session handler
exports.memcache = MEMCACHE.memcache;

var SSL = require (MODULE_NAME + '/ssl');
// gives settings for ssl in servers
exports.ssl = SSL.ssl;

var COMMON = require (MODULE_NAME + '/common');
exports.common = COMMON;

var API = require (MODULE_NAME + '/api');
exports.api = function (config) {
	API.create (config);
	return API;
};

var POST = require (MODULE_NAME + '/post');
exports.post = function (config) {
	POST.create (config);
	return POST;
};

var IO = require (MODULE_NAME + '/io');
exports.io = IO;