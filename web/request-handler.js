var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var url = require('url');

var actions = {
  'GET': function(request, response) {
    start(response);
  },
  'POST': function(request, response) {
    
  },
  'OPTIONS': function(request, response) {
    
  }
};

exports.handleRequest = function (req, res) {

  if (!archive.isUrlArchived(req.url)) {
    httpHelpers.sendResponse(res, 404);
  } 

  if (req.method === 'GET' && req.url === '/') {
    var absPath = path.join(__dirname, './public/index.html');
    httpHelpers.serveAssets(res, absPath);
  } else if (req.method === 'GET') {
    var absPath = archive.paths.archivedSites + req.url;
    httpHelpers.serveAssets(res, absPath);
  } 

  // res.end(archive.paths.list);
};
