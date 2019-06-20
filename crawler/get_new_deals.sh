#!/bin/bash

START_TIME=`date +%s`

# Configure the timeframe how old information can be | Options: 2, 12, 24
TIMEFRAME=2
# Configure Count of Categories
CATEGORY_COUNT=14
# Random Range for sleep timer
SLEEP_MIN=10
SLEEP_MAX=20

for ((i = 1; i<$CATEGORY_COUNT+1; i++)) 
do
    python3 GetDeals.py $i $TIMEFRAME
    SLEEP_TIME=$(awk -v min=$SLEEP_MIN -v max=$SLEEP_MAX 'BEGIN{srand(); print int(min+rand()*(max-min+1))}')
    sleep $SLEEP_TIME
done

END_TIME=`date +%s`
RUNTIME=$((END_TIME-START_TIME))
# prints script runtime
echo $RUNTIME
