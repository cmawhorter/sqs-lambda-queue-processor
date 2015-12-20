# cloudformation template

This template is a work in progress and DOES NOT currently work.  It is based on the ElasticBeanstalk Worker Environment sample app.

Everything seems to work correctly but for some reason it never gets beyond "CREATE_IN_PROGRESS".  The event log seems to match the ElasticBeanstalk sample app creation event log as a comparison -- except the final success.  Help and PR welcome.

## Manual Setup

Until the cloudformation template is up and running, here are some manual steps.

1. Go to ElasticBeanstalk in console
1. Create New Application
1. Name your application however you wish; something like "sqs-lambda-work-queue".  Optionally give it a description.  Click Next.
1. Choose to create a Worker Environment
1. Select the "Node.js" Predefined configuration
1. Select the "Load balancing, auto scaling" Environment type.  Click Next.
1. Under Application Version select "Upload your own" and upload the `eb-app-bundle.zip` from [this repo's releases](releases).  Click Next.
1. Enter any Environment Name you wish (I don't think it matters?) and description.  Click Next.
1. Check "Create this environment inside a VPC".  Click Next.
1. Optionally enter your email address to receive autoscale notifications (and other EB alerts) 
1. Enter the health check URL `/health`
1. Check "Enable rolling updates"
1. Under Health Reporting, select "Basic" from System type.  Click Next.
1. Enter an environment tag key "LAMBDA_WORKER_FUNCTION_NAME" and a value that is the Lambda function ARN that will be receiving our simulate SQS events and working on them. Click Next. (FIXME: this might be wrong and instead require editing the Configuration -> Software Configuration -> Environment Properties after the app is launched)
1. Leave Worker Details defaults (Worker queue, HTTP Path, MIME type, etc.).  Click Next.
1. (My knowledge of AWS VPC is minimal so this step may be incorrect.)  On VPC Configuration check both ELB and EC2 checkboxes for each AZ row. 
1. Select "Internal" for ELB visibility.  
1. (Some of those settings seem required to be able to advance. PR welcome.)  Click Next.
1. On Permissions, I can't remember if these roles already existed or not.  If they don't you can try to create them or I *think* they were generated when I [created the sample app](https://aws.amazon.com/elasticbeanstalk/getting-started/).
1. Select "aws-elasticbeanstalk-ec2-worker-role" in Instance profile
1. Select "aws-elasticbeanstalk-service-role" in Service role.  Click Next.
1. Review everything.  Click Launch.
1. Go to IAM in the console and edit the aws-elasticbeanstalk-ec2-worker-role and give it access to invoke the target lambda function by attaching the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1450517822000",
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": [
        "arn:aws:lambda:us-east-1:EXAMPLE:function:yourLambdaWorkerFunction"
      ]
    }
  ]
}
```

That will take a while and _should_ eventually finish and have GREEN health.   If it does, you can start sending messages to the SQS work queue immediately.  
