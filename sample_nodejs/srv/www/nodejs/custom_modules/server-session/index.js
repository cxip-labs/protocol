/*
	Memcached server side session management
	customize this later to allow more scalability
*/

var Memcached = require ('memcached');

var memcached = new Memcached ('localhost:11211', {
	maxKeySize: 250,
	maxExpiration: 2592000,
	maxValue: 1048576,
	poolSize: 10,
	algorithm: 'md5',
	reconnect: 18000000,
	timeout: 5000,
	retries: 5,
	failures: 5,
	retry: 30000,
	remove: false,
//	failOverServers: ['backupserver:22322'],
	keyCompression: true,
	idle: 5000
});

var exports = module.exports;

exports.memcache = memcached;
