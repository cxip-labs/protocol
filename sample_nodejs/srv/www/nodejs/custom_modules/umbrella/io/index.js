/*
	Umbrella scripts used for reading and writing files
*/

// https://nodejs.org/api/stream.html#stream_class_stream_readable
// https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
// https://nodejs.org/api/zlib.html
// we use this header to specify that the accept encoding header will change the result
// that way browser will know that it is important to specify gzip, deflate, etc.
// headers ['vary'] = 'Accept-Encoding';
/*

The server generating a 304 response must generate any of the following header fields that would have been sent in a 200 (OK) response to the same request: Cache-Control, Content-Location, Date, ETag, Expires, and Vary.

// you should not gzip and compress things like JPG PNG and other media types.
// it is because they are already compressed as it is. would be redundant

// https://github.com/Kilian/Trimage

"Content-Range": "bytes " + start + "-" + end + "/" + total,
"Accept-Ranges": "bytes",
"Content-Length": chunksize,

var etag = _ETAG;
if (!isLocal && isCacheable (request.url)) {
	headers ['Cache-Control'] = 'public, max-age=31536000';
	headers ['ETag'] = etag;
	if (typeof (request.headers ['if-none-match']) !== 'undefined') {
		if (request.headers ['if-none-match'] == etag) {
			respond = false;
			response.writeHead (304, 'Not Modified', headers);
			response.end ();
		}
	}
}
if (respond) {
	ReadFromFile (request, response, html_dir + request.url, headers);
}


*/

// WE NEED TO GZIP FILES AND CACHE BYTE LENGTHS AND ETAGS
// WOULD BE A GREAT IDEA DONT YOU THINK? ;)

'use strict';

const fs = require ('fs');
const zlib = require ('zlib');
// const gzip = zlib.createGzip ();
// const inp = fs.createReadStream ('input.txt');
// const out = fs.createWriteStream ('input.txt.gz');
const path = require ('path');
const child_process = require ('child_process');
const { pipeline } = require ('stream');

const contentTypeMap = require ('./mimes');
exports.contentTypeMap = contentTypeMap;

const defaultMime = contentTypeMap ['bin'];
const MIME = function (extension) {
	let mime = defaultMime;
	if (extension in contentTypeMap) {
		mime = contentTypeMap [extension];
	}
	return mime;
};

exports.MIME = MIME;

// allowing only certai ASCII characters
// space character (0x20 / 32)
// 0-9 A-Z a-z
// and a few special characters that are exceptions and will not break UNIX shells
// "'()+-,./=[]_
const ASCII = /[^\x20\x2b-\x39\x3d\x41-\x5b\x5d\x5f\x61-\x7a]/g;

let errorPage = undefined;
const ErrorPage = function (e) {
	if (typeof (e) !== 'undefined' && typeof (e) === 'string') {
		errorPage = e;
	}
	return e;
};
exports.errorPage = ErrorPage;

let encoding = true;
const EncodingSettings = function (e) {
	if (typeof (e) !== 'undefined' && typeof (e) === 'boolean') {
		encoding = e;
	}
	return e;
};

exports.encoding = EncodingSettings;

const cleanPath = function (filePath) {
	// now cleanup all offending characters
	filePath = filePath.replace (ASCII, '_');
	// remove all dotted dirs
	filePath = filePath.replace (/\/\.{1,}\//g, '/');
	// remove all prepended dots
	filePath = filePath.replace (/^\.{1,}/g, '');
	// remove all appended dots
	filePath = filePath.replace (/\.{1,}$/g, '');
	// remove all double forward slashes
	filePath = filePath.replace (/\/{2,}/g, '/');
	// remove all spacings
	let splits = filePath.split ('/');
	for (let i = 0, l = splits.length; i < l; i++) {
		splits [i] = splits [i].trim ();
	}
	filePath = splits.join ('/');
	if ((/(\/\.{1,}\/|^\.{1,}|\.{1,}$|\/{2,})/g).test (filePath)) {
		// this should create an infinite depth loop that will resolve only after a clean path
		filePath = cleanPath (filePath);
	}
	return filePath;
};

exports.sanitizePath = cleanPath;

exports.ReadFromFile = function (request, response, filePath, additionalHeaders, encode) {
	// we run this function to remove any attached variables that might break our IO
	let encodingCheck = true;
	if (typeof (encode) !== 'undefined' && typeof (encode) === 'boolean') {
		encodingCheck = encode;
	}
	let headers = {};
	if (typeof (additionalHeaders) !== 'undefined') {
		headers = additionalHeaders;
	}
	// remove all query params first
	filePath = filePath.split ('?')[0];
	// then try to decode it, if encoded
	try {
		// we first do a simple decode
		filePath = decodeURIComponent (filePath);
	}
	catch (e) {
		// if errors are encountered, we need to fix it
		filePath = decodeURIComponent (
			encodeURIComponent (
				unescape (
					filePath
				)
			)
		);
	}
	// clean it
	filePath = cleanPath (filePath);
	// force an index.html on dir
	if (filePath.endsWith ('/')) {
		filePath += 'index.html';
	}
	if (!filePath.startsWith ('/')) {
		filePath = '/' + filePath;
	}
	let extname = filePath.split ('.');
	extname = extname [extname.length - 1].toLowerCase ();
	let mime = MIME (extname);
	let readFile = function (secondary) {
		fs.stat (filePath, function (error, stats) {
			if (error) {
				if (error.code == 'ENOENT') {
					console.log (new Date ().toISOString () + ' --- 404 Not Found: ' + filePath);
					headers ['Content-Type'] = (errorPage ? 'text/html' : 'text/plain') + '; charset=utf-8';
					response.writeHead (404, 'Not Found', headers);
					response.end ((errorPage ? errorPage : '404 File Not Found'));
				}
				else {
					console.log ('UMBRELLA.io.ReadFromFile.fs.stat', error);
					headers ['Content-Type'] = 'text/plain; charset=utf-8';
					response.writeHead (500, headers);
					response.end ('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
				}
			}
			else if (stats.isDirectory ()) {
// 				filePath += '/index.html';
// 				extname = path.extname (filePath);
// 				contentType = ContentType (extname);
// 				readFile ();
				response.writeHead (301, 'Moved Permanently', {
					'Location': request.url + '/'
				});
				response.end ();
			}
			else {
				if (encodingCheck && encoding && !secondary && mime.gzip) {
					let acceptEncodings = request.headers ['accept-encoding'];
					let originalPath = filePath;
					let compressionType = '';
					if ((/br/i).test (acceptEncodings)) {
						compressionType = 'brotli';
						filePath += '.br';
						headers ['Content-Encoding'] = 'br';
					}
					else if ((/gzip/i).test (acceptEncodings)) {
						compressionType = 'zopfli';
						filePath += '.gz';
						headers ['Content-Encoding'] = 'gzip';
					}
					else if ((/deflate/i).test (acceptEncodings)) {
						compressionType = 'deflate';
						filePath += '.deflate';
						headers ['Content-Encoding'] = 'deflate';
					}
					// we check if file exists first
					if (!fs.existsSync (filePath)) {
						// file not found
						// time to make it
						switch (compressionType) {
							case 'brotli':
								child_process.exec ('brotli --force --quality=9 --output=' + filePath + ' ' + originalPath + '', function (err, stdout, stderr) {
									if (err) {
										console.log (err);
									}
									readFile (true);
								});
								break;
							case 'zopfli':
								child_process.exec ('zopfli ' + originalPath, function (err, stdout, stderr) {
									if (err) {
										console.log (err);
									}
									readFile (true);
								});
								break;
							case 'deflate':
								let readStream = fs.createReadStream (originalPath);
								let writeStream = fs.createWriteStream (filePath);
								writeStream.on ('close', function () {
									readFile (true);
								});
								readStream.pipe (zlib.createDeflateRaw ()).pipe (writeStream);
								break;
							default:
								//we do nothing since it seems like an unsupported compression
								readFile (true);
								break;
						}
					}
					else {
						readFile (true);
					}
				}
				else {
					// here we need to check some things
					//
					//	"Content-Range": "bytes " + start + "-" + end + "/" + total,
					//
					// headers ['Content-Type'] = 'multipart/byteranges; boundary=' + '3d6b6a416f9b5';
					//	"content-type": "multipart/related; boundary=Example_boundary_123456",
					//
					// https://www.keycdn.com/support/byte-range-requests
					//
					let total = stats.size;
					let size = stats.size;
					let range = request.headers.range;
					if (range) {
						/** Extracting Start and End value from Range Header */
						let [start, end] = range.replace(/bytes=/, "")
							.split("-");
						start = parseInt(start, 10);
						end = end ? parseInt(end, 10) : size - 1;

						if (!isNaN(start) && isNaN(end)) {
							start = start;
							end = size - 1;
						}
						if (isNaN(start) && !isNaN(end)) {
							start = size - end;
							end = size - 1;
						}

						let responded = false;
						// Handle unavailable range request
						if (start >= size || end >= size) {
							// Return the 416 Range Not Satisfiable.
							response.writeHead (416, {
								'Content-Range': `bytes */${size}`
							});
							responded = true;
							response.end ();
						}
						if (!responded) {

							let isUtf = mime.contentType.startsWith ('text/');
							/** Sending Partial Content With HTTP Code 206 */
							headers ['Content-Range'] = `bytes ${start}-${end}/${size}`;
							headers ['Accept-Ranges'] = 'bytes';
							headers ['Content-Length'] = end - start + 1;
							headers ['Content-Type'] = (isUtf ? mime.contentType + '; charset=utf-8' : mime.contentType);
							response.writeHead (206, 'Partial Content', headers);
							let readable = fs.createReadStream (filePath, { encoding: null, start: start, end: end });
// 							readable.pipe (response);
							pipeline (readable, response, err => {
								if (err) {
									if (err.code == 'ERR_STREAM_PREMATURE_CLOSE') {
										//
										readable.close ();
									} else {
										console.log (err);
									}
								}
							});
						}

					} else {
						let isUtf = mime.contentType.startsWith ('text/');
						headers ['Connection'] = 'keep-alive';
						headers ['Content-Range'] = 'bytes 0-' + (size - 1) + '/' + size;
						headers ['Accept-Ranges'] = 'bytes';
						headers ['Content-Length'] = size;
						headers ['Content-Type'] = (isUtf ? mime.contentType + '; charset=utf-8' : mime.contentType);
						response.writeHead (200, 'OK', headers);

						let readable = fs.createReadStream (filePath, { encoding: null });
// 						readable.pipe (response);
						pipeline (readable, response, err => {
							if (err) {
								if (err.code == 'ERR_STREAM_PREMATURE_CLOSE') {
									//
									readable.close ();
								} else {
									console.log (err);
								}
							}
						});
					}

// 					let realRange = (request.headers.range ? true : false);
// 					let range = (realRange ? request.headers.range : 'bytes=0-' + (total - 1));
// 					// we take out any sequential ranges (FOR NOW)
// 					let splits = range.replace (/[^\d\-\,]/g, '').split (',');
// 					if (splits.length > 1 || realRange) {
// 						// we error out
// 						headers ['Content-Range'] = 'bytes */' + total;
// 						response.writeHead (416, 'Requested Range Not Satisfiable', headers);
// 						response.end ();
// 					}
// 					else {
// 						let parts = splits [0].split ('-');
// 						let partialstart = parts [0];
// 						let partialend = parts [1];
// 						if (partialstart == '') {
// 							partialstart = '0';//(total - 1) - partialend;
// 							//partialend = total - 1;
// 						}
// 						if (typeof (partialend) === 'undefined' || partialend == '') {
// 							partialend = total - 1;
// 						}
// 						//
// 						let start = parseInt (partialstart, 10);
// 						let end = parseInt (partialend, 10);
// 						if (end >= total) {
// 							end = total - 1;
// 						}
// 						if (start >= total || (start < total && start > end)) {
// 							// we error out
// 							headers ['Content-Range'] = 'bytes */' + total;
// 							response.writeHead (416, 'Requested Range Not Satisfiable', headers);
// 							response.end ();
// 						}
// 						else {
// 							let chunksize = (realRange ? (end - start) : total);
// 							if (chunksize == 0) {
// 								chunksize = 1;
// 							}
// 							let out = fs.createReadStream (
// 								filePath,
// 								{
// 									encoding: null,
// 									start: start,
// 									end: end
// 								}
// 							);
// 							out.on ('error', function (error) {
// 								console.log ('UMBRELLA.io.ReadFromFile.fs.createReadStream', error);
// 								headers ['Content-Type'] = 'text/plain; charset=utf-8';
// 								response.writeHead (500, headers);
// 								response.end ('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
// 							});
// 							if (out.readable) {
// 								headers ['Connection'] = 'keep-alive';
// 								headers ['Content-Range'] = 'bytes ' + start + '-' + end + '/' + total;
// // 								headers ['Accept-Ranges'] = 'bytes';
// 								headers ['Content-Length'] = chunksize;
// 								headers ['Content-Type'] = mime.contentType;// + '; charset=utf-8';
// 								//headers ['Content-Encoding'] = 'gzip';
// 								//headers ['Transfer-Encoding'] = 'chunked';
// 								if (realRange) {
// 									response.writeHead (206, 'Partial Content', headers);
// 								}
// 								else {
// 									response.writeHead (200, 'OK', headers);
// 								}
// 								out.pipe (response);
// 							}
// 							else {
// 								console.log ('some weird funky shit going down');
// 							}
// 						}
// 					}
				}
			}
		});
	};
	readFile ();
};
