var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var http = require('http');

var actions = {
  'GET': function(request, response) {

  },
  'POST': function(request, response) {
    
  },
  'OPTIONS': function(request, response) {
    
  }
};

exports.handleRequest = function (req, res) {
  console.log('Handling request method ' + req.method + ' at url ' + req.url);

  var slicedUrl = req.url.slice(1);

  if (req.method === 'GET' && req.url === '/') {
    var absPath = path.join(__dirname, './public/index.html');
    httpHelpers.serveAssets(res, absPath);
  } else if (req.method === 'GET' && req.url === '/styles.css') {
    var absPath = path.join(__dirname, './public/styles.css');
    httpHelpers.serveAssets(res, absPath);
  } else if (req.method === 'GET' && req.url === '/loading.html') {
    console.log('entering get request and loading.html');
    var absPath = path.join(__dirname, './public/loading.html');
    httpHelpers.serveAssets(res, absPath);
  } else if (req.method === 'GET') {
    console.log('entering generic GET');
    archive.isUrlArchived(slicedUrl, function(exists) {
      if (exists) {
        var absPath = archive.paths.archivedSites + req.url;
        httpHelpers.serveAssets(res, absPath);
      } else {
        var request = http.get('http://' + slicedUrl, function(response) {
        }).on('error', function(err) {
          httpHelpers.serveAssets(res, undefined, 404);
        });
      }
    });
  } else if (req.method === 'POST') {
    httpHelpers.collectData(req, function(url) {
      archive.isUrlArchived(url, function(exists) {
        if (exists) {
          var absPath = archive.paths.archivedSites + req.url;
          httpHelpers.serveAssets(res, absPath);
        } else {
          archive.addUrlToList(url, function() {
            httpHelpers.serveAssets(res, '/loading.html', 302);
          });
        }
      });
    });
  }
};
