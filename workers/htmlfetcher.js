// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

exports.htmlfetcher = function() {
  archive.readListOfUrls(function(urlArray) {
    archive.downloadUrls(urlArray);
  });
};
