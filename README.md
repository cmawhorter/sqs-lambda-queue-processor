# sqs-lambda-queue-processor


## TODO:

  1. LAMBDA_WORKER_FUNCTION_NAME; set arn in cloudformation entry
2. add lambda:invokefunction policy to EB worker role aws-elasticbeanstalk-ec2-worker-role
  3. package app into release on github releases and edit CF template to download app zip to EB worker; AppSource
4. rename EB worker worker role to something more descriptive instead of "aws-elasticbeanstalk-ec2-worker-role"
5. remove scheduled tasks and dynamodb?
6. what do the s3 buckets do?  are they needed?
7. tune ec2 concurrency; can probably handle an increase  (it seems like only one instance of node is running on ec2?)
  8. Remove some required defaults from being editable in CF template e.g. AWSEBHttpPath
  9. make node.js version static
10. Dynamic error visibility;  currently set to "-1" i.e. retry as quickly as possible.  exp backoff would be nice or a longer time by default at least
11. remove external access to cluster
