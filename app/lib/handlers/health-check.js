'use strict';

var LAMBDA_WORKER_FUNCTION_NAME = process.env['LAMBDA_WORKER_FUNCTION_NAME'];

var validate = require('../validate.js')
  , parseJson = require('../parse-json.js')
  , lambda = require('../lambda.js');

var errorHandlers = require('./errors.js');

module.exports = function(req, res) {
  lambda.pingTrigger(LAMBDA_WORKER_FUNCTION_NAME, function(err, healthy) {
    if (err) {
      errorHandlers.generic(req, res, 500, err.message);
      return;
    }
    if (true === healthy) {
      res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
      res.end();
    }
    else {
      errorHandlers.generic(req, res, 502, 'Could Not Reach Remote Lambda Worker');
      return;
    }
  });
};
