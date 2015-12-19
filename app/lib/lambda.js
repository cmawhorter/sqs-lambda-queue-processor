'use strict';

var AWS = require('aws-sdk');
var lambda = new AWS.Lambda({ logger: console, region: 'us-east-1' });

var parseJson = require('./parse-json.js');

var ATTR_HEADER_PREFIX = 'x-aws-sqsd-attr-';

var lambdaService = module.exports = {
  createLambdaEventFromSqsMessage: function(req, sqsMessage) {
    // attempts to predict what sqs events will look like to lambda to smooth transition (if aws implements this feature)
    // references:
    // https://gist.github.com/yyolk/cd22e8a3faf7fd75997b
    // http://docs.aws.amazon.com/cli/latest/reference/sqs/receive-message.html
    // http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html
    var message = {
      Body: sqsMessage,
      // ReceiptHandle: '', // unsupported by EB worker sqsd
      // MD5OfBody: '', // unsupported by EB worker sqsd
      // MD5OfMessageAttributes: '', // unsupported by EB worker sqsd
      MessageId: req.headers['x-aws-sqsd-msgid'],
      Attributes: {
        ApproximateFirstReceiveTimestamp: req.headers['x-aws-sqsd-first-received-at'],
        SenderId: req.headers['x-aws-sqsd-sender-id'],
        ApproximateReceiveCount: req.headers['x-aws-sqsd-receive-count'],
        // SentTimestamp: '' // unsupported by EB worker sqsd
      },
      MessageAttributes: {},
    };
    for (var k in req.headers) {
      var headerName = k.toLowerCase();
      if (headerName.indexOf(ATTR_HEADER_PREFIX) === 0) {
        var attrName = k.substr(ATTR_HEADER_PREFIX.length);
        // EB worker sqsd always discards binary attributes - see http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html
        message.MessageAttributes[attrName] = {
          DataType: 'String',
          StringValue: req.headers[k],
        };
      }
    }
    return {
      Records: [
        {
          EventVersion: '0.0',
          EventVersion_SQSLAMBDA: '1.0',
          EventTime: new Date().toISOString(),
          EventSource: 'aws:sqs',
          EventQueueArn: req.headers['x-aws-sqsd-queue'],
          Sqs: {
            Messages: [ message ],  // we are always only one
          }
        },
      ],
    };
  },
  invocationResponseHandler: function(callback) {
    return function(err, data) {
      if (err) {
        callback(err);
        return;
      }
      if (200 === data.StatusCode) { // RequestResponse = 200; Event = 202; DryRun = 204
        var payload = parseJson(data.Payload, callback);
        if (payload) {
          callback(null, payload);
          return;
        }
        else {
          callback(null, new Error('payload missing from response'));
          return;
        }
      }
      else {
        callback(null, new Error('invalid response type: ' + data.StatusCode));
        return;
      }
    };
  },
  trigger: function(lambdaWorkerFunctionName, triggeredEvent, callback) { // callback signature = callback(local app err, data | remote lamba err)
    var handler = lambdaService.invocationResponseHandler(callback)
      , req;
    req = lambda.invoke({
      FunctionName: lambdaWorkerFunctionName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(triggeredEvent)
    }, handler);
    return req;
  },
  pingTrigger: function(lambdaWorkerFunctionName, callback) {
    lambda.invoke({
      FunctionName: lambdaWorkerFunctionName,
      InvocationType: 'DryRun',
    }, function(err, res) {
      if (err) {
        callback(err);
        return;
      }
      else if (res.StatusCode == '204') {
        callback(null, true);
      }
      else {
        callback(null, false);
        return;
      }
    });
  },
};
