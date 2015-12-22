#!/bin/bash
SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/aws.sh

AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION aws sqs send-message-batch \
  --queue-url "$1" \
  --cli-input-json '{ "Entries": [ { "Id": "id_1", "MessageBody": "{ \"batch\": \"1\" }", "DelaySeconds": 0 }, { "Id": "id_2", "MessageBody": "{ \"batch\": \"2\" }", "DelaySeconds": 0 }, { "Id": "id_3", "MessageBody": "{ \"batch\": \"3\" }", "DelaySeconds": 0 }, { "Id": "id_4", "MessageBody": "{ \"batch\": \"4\" }", "DelaySeconds": 0 }, { "Id": "id_5", "MessageBody": "{ \"batch\": \"5\" }", "DelaySeconds": 0 }, { "Id": "id_6", "MessageBody": "{ \"batch\": \"6\" }", "DelaySeconds": 0 }, { "Id": "id_7", "MessageBody": "{ \"batch\": \"7\" }", "DelaySeconds": 0 }, { "Id": "id_8", "MessageBody": "{ \"batch\": \"8\" }", "DelaySeconds": 0 }, { "Id": "id_9", "MessageBody": "{ \"batch\": \"9\" }", "DelaySeconds": 0 }, { "Id": "id_10", "MessageBody": "{ \"batch\": \"10\" }", "DelaySeconds": 0 } ] }'

