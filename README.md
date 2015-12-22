# sqs-lambda-queue-processor

Process AWS SQS messages with an AWS Lambda function.  aka Use a Lambda function as your queue worker/processor.

Lambda functions can be automatically invoked in a variety of ways and from many event sources (DynamoDB, S3, SNS) but one service is conspiculously absent: SQS.

There is no way to configure SQS to send messages to a Lambda function.  This repo fixes that.

## Get Started

1. Create a new AWS Lambda function to process our SQS events.  See below for details.
1. In your AWS console, go to CloudFormation and create a New Stack using `cloudformation/template.json`

That's it.  When messages are sent to the queue, they'll be processed by your Lambda function.

## How it works

There is no SQS event source in Lambda and thus no way to use Lambda directly with SQS to process messages as they come in.  You need an intermediary server to poll the queue and do all that boring SQS stuff. 

Luckily AWS has [ElasticBeanstalk Worker Environments](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html) -- which are designed to process SQS work queues.

The EB app in this repo is designed to work with that environment and will proxy SQS messages to your Lambda function as SQS Events*.

_*There are no such thing as SQS Events so this attempts to predict their structure._

## SQS Event Structure

The structure of the our predicted/simulated SQS Event is based on a combination of [existing SNS events](https://gist.github.com/yyolk/cd22e8a3faf7fd75997b) and the [structure of SQS message responses](http://docs.aws.amazon.com/cli/latest/reference/sqs/receive-message.html#examples).

```js
{
  Records: [
    {
      EventVersion: '0.0', // Always "0.0". Real AWS events have real version.
      EventVersion_SQSLAMBDA: '1.0', // Our version 
      EventTime: '2015-12-20T02:44:27.893Z',
      EventSource: 'aws:sqs',
      EventQueueArn: 'aws:sqs:queue:...',
      Sqs: {
        // Only one message is sent always, but SQS does have a receive batch, so this seems to be
        // a probable structure
        Messages: [ message ],  // message = the SQS Message object
      }
    },
  ],
}
```

You can view the code that builds the event in `app/lib/lambda.js`.  

## AWS Lambda Queue Worker

Processing our SQS events is just as easy as any other event source.

For example.  Let's say we have a very useless SQS queue to add two integers together.  It receives messages that have two properties `x` and `y` and we want to add them and log the result.

```js
// pretend we created many SQS messages that look similar to this:
{ x: 3, y: 9 }
```

```js
// Warning: Contains no error handling
exports.handler = function(event, context) {
  // get the actual SQS message
  var sqsMessage = event.Records[0].Sqs.Messages[0];
  // get the body of that message
  var body = sqsMessage.Body;
  var result = body.x + body.y;
  // log our result
  console.log('Total = ', result);
  // tell SQS that the message was successfully processed (and should be deleted)
  // this is currently the only supported Action
  // anything else will lead to a failure/retry
  context.succeed({
    Action: 'DELETE'
  });
};
```

A lambda function used to test the app exists at `lambda-test-harness/app.js`.  It includes handlers that simualate success, failure, error.

## About the CloudFormation Template

There are two template files included:

1. `template.json` - Quickest way to get set up
1. `template-without-role.json` - If you phear me, this is a very of the template without the IAM Role creation.  See below for more.

## Manually Create Role

The `template.json` file does everything including creating the necessary role.  However, if you don't want that you can manually create the role.

1. Create an Elastic Beanstalk sample application with a Worker environment.  The specifics don't matter, but this will create an "aws-elasticbeanstalk-ec2-worker-role" with [an almost-ready policy](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.iam.roles.aeb.tiers.worker.html)
1. Edit the Role and add a new inline policy.  The contents are below.
1. Create a new CloudFormatation stack and enter "aws-elasticbeanstalk-ec2-worker-role" when prompted

### Inline Policy

This policy gives your EC2 instances the permission to invoke your Lambda worker function.

Edit the Resource line below with your Lambda ARN.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": [
        "arn:aws:lambda:us-east-1:1234567890:function:exampleFunctionName"
      ]
    }
  ]
}
```
