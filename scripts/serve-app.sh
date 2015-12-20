#!/bin/bash
SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/aws.sh
cd $SCRIPTDIR/../app
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY LAMBDA_FUNCTION=justLogIt LAMBDA_REGION=us-east-1 node app.js
