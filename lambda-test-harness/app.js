// A lambda function that gives simulated responses to our SQS events.

// Set your lambda function to exports.imperfecthandler to simulate failures

console.log('Loading function');

function delayedResponse(contextHandler) {
  setTimeout(function() {
    contextHandler();
  }, Math.random() * 1000); // up to ~1s delay
}

exports.successhandler = function(event, context) {
  delayedResponse(function() {
    context.succeed({
      Action: 'DELETE', // required
      date: new Date().toISOString(),
    });
  });
};

exports.softfailurehandler = function(event, context) {
  delayedResponse(function() {
    context.succeed({
      Action: 'NOT_A_VALID_ACTION', // required
      date: new Date().toISOString(),
    });
  });
};

exports.failurehandler = function(event, context) {
  delayedResponse(function() {
    context.fail(new Error('message not processed; ' + new Date().toISOString()));
  });
};

exports.imperfecthandler = function(event, context) {
  var r = Math.random();
  if (r > 0.4) { // ~60% of time return success
    return exports.successhandler(event, context);
  }
  else { // ~40% of the time fail
    // 50/50 soft/hard failures
    return exports[Math.random() % 2 === 0 ? 'softfailurehandler' : 'failurehandler'](event, context);
  }
};

exports.echohandler = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  var message = event.Records[0].Sqs.Messages[0];
  console.log('From SQS:', message.Body);
  context.succeed({
    Action: 'DELETE',
    date: new Date().toISOString(),
  });
};

