'use strict';

var fs = require('fs');

module.exports = function log(entry) {
  fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};
