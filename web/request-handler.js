var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var request = require('request');

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
    httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html');
  } else if (req.method === 'GET' && req.url === '/styles.css') {
    httpHelpers.serveAssets(res, archive.paths.siteAssets + req.url);
  } else if (req.method === 'GET' && req.url === '/loading.html') {
    httpHelpers.serveAssets(res, archive.paths.siteAssets + req.url);
  } else if (req.method === 'POST' && req.url === '/' || req.method === 'POST' && req.url === '/loading.html') {
    httpHelpers.collectData(req, function(url) {
      request('http://' + url, function(err) {
        if (!err) {
          archive.isUrlInList(url, function(exists) {
            if (!exists) {
              archive.addUrlToList(url, function() {
                httpHelpers.serveAssets(res, '/loading.html', 302);
              });
            } else {
              archive.isUrlArchived(url, function(exists) {
                if (exists) {
                  var absPath = archive.paths.archivedSites + '/' + url;
                  httpHelpers.serveAssets(res, absPath);
                } else {
                  httpHelpers.serveAssets(res, '/loading.html', 302);
                }
              });
            }
          });
        } else {
          httpHelpers.serveAssets(res, 'https://http.cat/404', 302);
        }
      });
    });
  }
};
