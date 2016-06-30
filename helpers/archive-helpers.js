var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var arr = data.split('\n');
    arr.splice(-1, 1);
    callback(arr);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(urls.indexOf(url) > - 1);
  }); 
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if (err) {
      throw err;
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  if (url === '') {
    callback(true);
  }
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) {
      throw err;
    }
    callback(files.indexOf(url) > -1);
  });
};

exports.downloadUrls = function(urlArray) {
  var recursiveDownloader = function(i) {
    if (i < urlArray.length) {
      exports.isUrlArchived(urlArray[i], function(exists) {
        if (!exists) {
          request('http://' + urlArray[i])
          .pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + urlArray[i]));
        }
        recursiveDownloader(i + 1);
      });
    }
  };
  recursiveDownloader(0);
};
