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
  // GET: if archived => archived html
  // GET: if not archived => 404

  var slicedUrl = req.url.slice(1);

  if (req.method === 'GET' && req.url === '/') {
    var absPath = path.join(__dirname, './public/index.html');
    httpHelpers.serveAssets(res, absPath);
  } else if (req.method === 'GET') {
    archive.isUrlArchived(slicedUrl, function(exists) {
      if (exists) {
        var absPath = archive.paths.archivedSites + req.url;
        httpHelpers.serveAssets(res, absPath);
      } else {
        var request = http.get('http://' + slicedUrl, function(response) {
     
        }).on('error', function(err) {
          httpHelpers.sendResponse(res, 404);
        });
   
      }
    });
  } else if (req.method === 'POST') {
    console.log('inside post!');
    httpHelpers.collectData(req, function(url) {
      archive.addUrlToList(url);
      httpHelpers.sendResponse(res, 302);
    });
  }

  // res.end(archive.paths.list);
};
