#!/bin/bash
SCRIPTDIR=$(dirname $0)

for i in `seq 1 10`;
do
  $SCRIPTDIR/aws-populate-queue.sh "$1"
done

echo 'Done. Created 1000 messages.'
