#!/bin/bash
SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/aws.sh
cd $SCRIPTDIR/../app
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY LAMBDA_WORKER_FUNCTION_NAME=justLogIt node app.js
