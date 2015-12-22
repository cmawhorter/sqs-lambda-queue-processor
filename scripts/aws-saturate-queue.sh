#!/bin/bash
SCRIPTDIR=$(dirname $0)

for i in `seq 1 10000`;
do
  $SCRIPTDIR/aws-populate-queue.sh "$1"
done

echo 'Done. Created 100,000 messages.'
