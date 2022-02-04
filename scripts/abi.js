'use strict';

const fs = require('fs');
const buildDir = './build/contracts';
const abiDir = './abi';

const recursiveBuild = function (buildDir, abiDir) {
  fs.readdir(buildDir, function (err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function (file) {
      fs.stat(buildDir + '/' + file, function (err, stats) {
        if (err) {
          throw err;
        }
        if (stats.isDirectory()) {
          // we go into it
          fs.mkdir(abiDir + '/' + file, function () {
            recursiveBuild(buildDir + '/' + file, abiDir + '/' + file);
          });
        } else {
          if (file.endsWith('.json')) {
            console.log(file);
            fs.readFile(buildDir + '/' + file, 'utf8', function (err, data) {
              if (err) {
                throw err;
              }
              fs.writeFile(
                abiDir + '/' + file,
                JSON.stringify(JSON.parse(data).abi, null, 4),
                function (err) {
                  if (err) {
                    throw err;
                  }
                }
              );
            });
          }
        }
      });
    });
  });
};
fs.mkdir(abiDir, function () {
  recursiveBuild(buildDir, abiDir);
});
