const functions = require('firebase-functions');
const admin = require('firebase-admin');
var request = require('request');
var parseString = require('xml2js').parseString;

admin.initializeApp(functions.config().firebase);

exports.hentYr = functions.https.onRequest((req, res) => {
  console.log("Hent Værdata");
  request('https://www.yr.no/sted/Norge/Rogaland/Haugesund/Eivindsvatnet/varsel.xml', (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    //console.log('body:', body); // Print the JSON for the YR varsel.
    parseString(body, (err, result) => {
      var weatherRef = admin.firestore().collection('weather');
      //console.dir(result);
      if (err !== null)
        console.log(err);

      var weather = new Object();
      var dateTemp = result.weatherdata.meta[0].lastupdate[0] + "+02:00";
      console.log("dateTemp", dateTemp);
      console.log("dateTemp", Date.parse(dateTemp));
      weather.lastupdate = new Date(dateTemp);
      weather.link = result.weatherdata.links[0].link[2].$.url;
      weather.symbol = result.weatherdata.forecast[0].tabular[0].time[0].symbol[0];
      weather.wind = result.weatherdata.forecast[0].tabular[0].time[0].windSpeed[0].$;
      weather.time = getDateNoTime(result.weatherdata.forecast[0].tabular[0].time[0].$);
      weather.temperature = result.weatherdata.forecast[0].tabular[0].time[0].temperature[0].$.value;
      var tempForecast = result.weatherdata.forecast[0].tabular[0].time;
      console.log("length", tempForecast.length);
      for (var i = 0; i < tempForecast.length; i++) {

        console.log("periode", tempForecast[i].$.period);
        if (tempForecast[i].$.period === "3") {
          weather.forecast = new Object();
          console.log("YEAH");
          weather.forecast.symbol = tempForecast[i].symbol[0];
          weather.forecast.wind = tempForecast[i].windSpeed[0].$;
          weather.forecast.time = getDateNoTime(tempForecast[i].$);
          weather.forecast.temperature = tempForecast[i].temperature[0].$.value;

          if ((new Date(weather.time.from)).setHours(0, 0, 0, 0) === (new Date(weather.forecast.time.from)).setHours(0, 0, 0, 0)) {
            console.log("samme dag");
            weather.forecast.sameDay = true;
          }
          else {
            weather.forecast.sameDay = false;
          }
          break;
        }
      }
      // legg til hele fila;  
      //weather.complete = result;

      console.log("ISOString" + weather.lastupdate.toISOString());
      weatherRef.doc(weather.lastupdate.toISOString()).set(weather);
      //result.lastupdate = result.weatherdata.meta[0].lastupdate[0];
      return res.send(weather);

    });


  })

});

function getDateNoTime(time) {
  time.from = new Date(time.from + "+02:00");
  time.to = new Date(time.to + "+02:00");
  return time;
}


