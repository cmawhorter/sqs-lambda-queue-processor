'use strict';

module.exports = function(k, httpObject) {
  for (var i=0; i < httpObject.rawHeaders.length; i+=2) {
    var headerName = httpObject.rawHeaders[i].toLowerCase();
    if (headerName === k) {
      return httpObject.rawHeaders[i];
    }
  }
  return k;
};
