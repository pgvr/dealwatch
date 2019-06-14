#!/bin/bash

START_TIME=`date +%s`

# Configure the timeframe how old information can be | Options: 2, 12, 24
TIMEFRAME=2
# Configure Count of Categories
CATEGORY_COUNT=14
# Configure Sleep Time between Categories
SLEEP_TIME=2

for ((i = 0; i<$CATEGORY_COUNT; i++)) 
do
    python3 GetDeals.py $i $TIMEFRAME
    sleep $SLEEP_TIME
done

END_TIME=`date +%s`
RUNTIME=$((END_TIME-START_TIME))
# prints script runtime
echo $RUNTIME
