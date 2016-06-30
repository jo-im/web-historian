var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  // 'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  statusCode = statusCode || 200;
  exports.headers['Content-Type'] = 'text/html';

  // if POST
  if (statusCode === 302) {
    exports.headers['Location'] = asset;
    res.writeHead(statusCode, exports.headers);
    res.end();
  } else {
    if (asset) { 
      if (asset.slice(-3) === 'css') {
        console.log('changing content-type to text/css');
        exports.headers['Content-Type'] = 'text/css';
      } 
      fs.readFile(asset, 'utf8', function(err, data) {
        if (err) {
          throw err;
        }
        res.writeHead(statusCode, exports.headers);
        res.write(data);
        res.end();
      });
    } else {
      res.end();
    }
  }
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data.slice(4));
  });
};