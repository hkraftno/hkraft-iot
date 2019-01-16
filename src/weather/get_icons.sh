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


#!/bin/bash

COUNTER=1
while [  $COUNTER -lt 51 ]; do
  curl https://api.met.no/weatherapi/weathericon/1.1/\?symbol\=${COUNTER}\&is_night\=1\&content_type\=image/svg%2Bxml -o ${COUNTER}
  let COUNTER=COUNTER+1 
done

mv 1 SunNight.svg
mv   2 LightCloudNight.svg
mv   3 PartlyCloudNight.svg
mv   4 CloudNight.svg
mv   5 LightRainSunNight.svg
mv   6 LightRainThunderSunNight.svg
mv   7 SleetSunNight.svg
mv   8 SnowSunNight.svg
mv   9 LightRainNight.svg
mv   10 RainNight.svg
mv   11 RainThunderNight.svg
mv   12 SleetNight.svg
mv   13 SnowNight.svg
mv   14 SnowThunderNight.svg
mv   15 FogNight.svg
mv   20 SleetSunThunderNight.svg
mv   21 SnowSunThunderNight.svg
mv   22 LightRainThunderNight.svg
mv   23 SleetThunderNight.svg
mv   24 DrizzleThunderSunNight.svg
mv   25 RainThunderSunNight.svg
mv   26 LightSleetThunderSunNight.svg
mv   27 HeavySleetThunderSunNight.svg
mv   28 LightSnowThunderSunNight.svg
mv   29 HeavySnowThunderSunNight.svg
mv   30 DrizzleThunderNight.svg
mv   31 LightSleetThunderNight.svg
mv   32 HeavySleetThunderNight.svg
mv   33 LightSnowThunderNight.svg
mv   34 HeavySnowThunderNight.svg
mv   40 DrizzleSunNight.svg
mv   41 RainSunNight.svg
mv   42 LightSleetSunNight.svg
mv   43 HeavySleetSunNight.svg
mv   44 LightSnowSunNight.svg
mv   45 HeavysnowSunNight.svg
mv   46 DrizzleNight.svg
mv   47 LightSleetNight.svg
mv   48 HeavySleetNight.svg
mv   49 LightSnowNight.svg
mv   50 HeavySnowNight.svg



