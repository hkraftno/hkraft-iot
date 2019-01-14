import React from 'react';

import cloud from './weather/021-cloud.svg';
import cloudy1 from './weather/021-cloudy-1.svg';
//import cloudy from './weather/021-cloudy.svg';
//night1 from './weather/021-night-1.svg';
//import night from './weather/021-night.svg';
import rain1 from './weather/021-rain-1.svg';
import rain2 from './weather/021-rain-2.svg';
import rain from './weather/021-rain.svg';
import snowflake from './weather/021-snowflake.svg';
import snowing1 from './weather/021-snowing-1.svg';
import snowing2 from './weather/021-snowing-2.svg';
import snowing3 from './weather/021-snowing-3.svg';
import snowing from './weather/021-snowing.svg';
import storm from './weather/021-storm.svg';
//import summer from './weather/021-summer.svg';
import sun from './weather/021-sun.svg';
//import sunrise from './weather/021-sunrise.svg';
//import sunset from './weather/021-sunset.svg';
//import tornado from './weather/021-tornado.svg';


const symbolMap = {
  1: sun,
  2: sun,
  3: cloudy1,
  4: cloud,
  40: rain1,
  5: rain1,
  41: rain1,
  24: rain1, //lett regn og torden
  6: rain1, //Torden og byger
  25: storm,
  42: rain1,
  7: rain1,
  43: snowing,
  26: snowing,
  20: storm,
  27: storm,
  44: snowing,
  8: snowing,
  45:snowing,
  28: snowing,
  21: storm, 
  29: storm,
  46: rain,
  9: rain,
  10: rain2,
  30: storm,
  22:storm,
  11: storm,
  47: rain2,
  12: rain2,
  48: snowing2,
  31: storm,
  23: storm,
  32: storm,
  49: snowing3,
  13: snowing3,
  50: snowflake,
  33: snowing1,
  14: snowing1,
  34: snowflake,
  15: cloud

};
const Prognose = props => (
  <div>
    <img src={symbolMap[props.symbol]} alt={props.description} height="100px"/>
  </div>
);

export default Prognose;