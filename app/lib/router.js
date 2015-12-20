'use strict';

var log = require('./logger.js');

var errorHandlers = require('./handlers/errors.js')
  , sqsMessageHandler = require('./handlers/sqs-message.js')
  , healthCheckHandler = require('./handlers/health-check.js');

var routes = {
  POST: {
    '/': sqsMessageHandler,
    '/scheduled': function(req, res) {
      // not implemented; just discard messages that are getting passed
      // FIXME: remove scheduled tasks
      res.writeHead(200);
      res.end();
    },
  },
  GET: {
    '/health': healthCheckHandler,
  },
};

module.exports = function(req, res) {
  var handler = (routes[req.method] || {})[req.url] || errorHandlers.notFound;
  log(req.method + ' ' + req.url + ' -> MessageId: ' + (req.headers['x-aws-sqsd-msgid'] || 'null'));
  try {
    handler(req, res);
  }
  catch (err) {
    errorHandlers.generic(req, res, 500, err.message);
  }
};
