'use strict';

var port = process.env.PORT || 3000
  , http = require('http');

var router = require('./lib/router.js');
var IS_DEV = process.env.NODE_ENV === 'development';

var server = http.createServer(function(req, res) {
  if (IS_DEV) {
    console.log('%s %s %s', req.method, req.url, req.headers['date']);
    var _writeHead = res.writeHead;
    res.writeHead = function() {
      console.log('%s %s -> ', req.method, req.url, arguments);
      _writeHead.apply(this, arguments);
    };
  }
  router(req, res);
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
console.log('Env', process.env);

module.exports = server;
