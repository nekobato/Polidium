const remote = require('remote');
const fs = remote.require('fs');

function readDir(path) {
  fs.readdir(path, function(err, files) {
    callback(err, path);
  });
}
