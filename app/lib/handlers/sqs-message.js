'use strict';

var LAMBDA_WORKER_FUNCTION_NAME = process.env.LAMBDA_FUNCTION;

var validate = require('../validate.js')
  , parseJson = require('../parse-json.js')
  , lambda = require('../lambda.js');

var errorHandlers = require('./errors.js');

var forwardMessageToLambdaWorker = function(req, res, body) {
  var sqsMessage = parseJson(body, function(err) { errorHandlers.badJson(req, res, err.message); });
  if (sqsMessage) {
    var lambdaEvent = lambda.createLambdaEventFromSqsMessage(req, sqsMessage);
    lambda.trigger(LAMBDA_WORKER_FUNCTION_NAME, lambdaEvent, function(err, data) {
      if (err) {
        // local, app error
        errorHandlers.generic(req, res, 500, err.message);
        return;
      }
      else if (data instanceof Error) {
        // remote lamba had error; "bad gateway"
        errorHandlers.generic(req, res, 502, data.message);
        return;
      }
      else {
        // yay?
        if (data.Action) {
          switch (data.Action) {
            case 'DELETE':
              // yay! tells EB worker sqsd that message was processed and it issues a DeleteMessage
              res.writeHead(200);
              res.end();
              return;
            default:
              // nothing else is supported
              errorHandlers.generic(req, res, 501, 'Invalid response Action: ' + data.Action);
              return;
          }
        }
        else {
          errorHandlers.generic(req, res, 502, 'Lambda Worker Response Formatted Incorrectly');
          return;
        }
      }
    });
  }
  else {
    errorHandlers.badJson(req, res, 'Invalid JSON Structure');
    return;
  }
};

module.exports = function(req, res) {
  var body = '';
  if (!validate.isContentTypeJson(req.headers['content-type'])) {
    errorHandlers.notAcceptable(req, res);
    return;
  }
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    forwardMessageToLambdaWorker(req, res, body);
  });
};
