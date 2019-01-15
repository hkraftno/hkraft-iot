#!/bin/bash

COUNTER=1
while [  $COUNTER -lt 51 ]; do
  curl https://api.met.no/weatherapi/weathericon/1.1/\?symbol\=${COUNTER}\&content_type\=image/svg%2Bxml -o ${COUNTER}
  let COUNTER=COUNTER+1 
done


mv 1 Sun.svg
mv   2 LightCloud.svg
mv   3 PartlyCloud.svg
mv   4 Cloud.svg
mv   5 LightRainSun.svg
mv   6 LightRainThunderSun.svg
mv   7 SleetSun.svg
mv   8 SnowSun.svg
mv   9 LightRain.svg
mv   10 Rain.svg
mv   11 RainThunder.svg
mv   12 Sleet.svg
mv   13 Snow.svg
mv   14 SnowThunder.svg
mv   15 Fog.svg
mv   20 SleetSunThunder.svg
mv   21 SnowSunThunder.svg
mv   22 LightRainThunder.svg
mv   23 SleetThunder.svg
mv   24 DrizzleThunderSun.svg
mv   25 RainThunderSun.svg
mv   26 LightSleetThunderSun.svg
mv   27 HeavySleetThunderSun.svg
mv   28 LightSnowThunderSun.svg
mv   29 HeavySnowThunderSun.svg
mv   30 DrizzleThunder.svg
mv   31 LightSleetThunder.svg
mv   32 HeavySleetThunder.svg
mv   33 LightSnowThunder.svg
mv   34 HeavySnowThunder.svg
mv   40 DrizzleSun.svg
mv   41 RainSun.svg
mv   42 LightSleetSun.svg
mv   43 HeavySleetSun.svg
mv   44 LightSnowSun.svg
mv   45 HeavysnowSun.svg
mv   46 Drizzle.svg
mv   47 LightSleet.svg
mv   48 HeavySleet.svg
mv   49 LightSnow.svg
mv   50 HeavySnow.svg


