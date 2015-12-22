#!/bin/bash
SCRIPTDIR=$(dirname $0)
cd $SCRIPTDIR
curl -vvv -X POST --data 'someplaintext' \
  -H 'User-Agent: aws-sqsd/1.1' \
  -H 'X-Aws-Sqsd-Msgid: de305d54-75b4-431b-adb2-eb6b9e546014' \
  -H 'X-Aws-Sqsd-Queue: my-mock-queue' \
  -H 'X-Aws-Sqsd-First-Received-At: 2015-12-19T08:04:37.358Z' \
  -H 'X-Aws-Sqsd-Receive-Count: 1' \
  -H 'X-Aws-Sqsd-Attr-someattr: foo' \
  -H 'X-Aws-Sqsd-Attr-otherattr: bar' \
  -H 'Content-Type: application/json' \
  http://localhost:3000/
