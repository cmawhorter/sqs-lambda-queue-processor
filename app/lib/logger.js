'use strict';

var fs = require('fs');

var IS_DEV = process.env.NODE_ENV === 'development';

module.exports = function log(entry) {
  if (IS_DEV) {
    console.log(entry);
  }
  else {
    fs.appendFileSync('/tmp/sample-app.log', '[' + new Date().toISOString() + '] ' + entry + '\n');
  }
};
