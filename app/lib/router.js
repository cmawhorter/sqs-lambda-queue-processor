'use strict';

var errorHandlers = require('./handlers/errors.js')
  , sqsMessageHandler = require('./handlers/sqs-message.js')
  , healthCheckHandler = require('./handlers/health-check.js');

var routes = {
  POST: {
    '/': sqsMessageHandler,
  },
  GET: {
    '/health': healthCheckHandler,
  },
};

module.exports = function(req, res) {
  var handler = (routes[req.method] || {})[req.url] || errorHandlers.notFound;
  try {
    handler(req, res);
  }
  catch (err) {
    errorHandlers.generic(req, res, 500, err.message);
  }
};
