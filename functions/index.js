const functions = require('firebase-functions');
const admin = require('firebase-admin');
var request = require('request');
var parseString = require('xml2js').parseString;

admin.initializeApp(functions.config().firebase);

exports.hentYr = functions.https.onRequest((req, res) => {
  console.log("Hent værdata");
  request('https://www.yr.no/sted/Norge/Rogaland/Haugesund/Eivindsvatnet/varsel.xml', (error, response, body) => {
    console.log('the error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code
    console.log('body:', body); // Print the JSON for the YR varsel.
    parseString(body, (err, result) => {
      var weatherRef = admin.firestore().collection('weather');
      console.dir(result);
      if (err !== null)
        console.log('not null error: ', err);

      var dateTemp = result.weatherdata.meta[0].lastupdate[0] + "+02:00";
      console.log("dateTemp", dateTemp);
      console.log("dateTemp", Date.parse(dateTemp));

      var weather = new Object();

      weather.lastupdate = admin.firestore.Timestamp.fromDate(new Date(dateTemp));
      weather.link = result.weatherdata.links[0].link[2].$.url;
      weather.symbol = result.weatherdata.forecast[0].tabular[0].time[0].symbol[0];
      weather.wind = result.weatherdata.forecast[0].tabular[0].time[0].windSpeed[0].$;
      weather.time = admin.firestore.Timestamp.fromDate(getDateNoTime(result.weatherdata.forecast[0].tabular[0].time[0].$))
      weather.temperature = result.weatherdata.forecast[0].tabular[0].time[0].temperature[0].$.value;

      var tempForecast = result.weatherdata.forecast[0].tabular[0].time;
      console.log("length", tempForecast.length);

      for (var i = 0; i < tempForecast.length; i++) {
        console.log("periode", tempForecast[i].$.period);
        if (tempForecast[i].$.period === "3") {
          weather.forecast = new Object();
          weather.forecast.symbol = tempForecast[i].symbol[0];
          weather.forecast.wind = tempForecast[i].windSpeed[0].$;
          weather.forecast.time = admin.firestore.Timestamp.fromDate(getDateNoTime(tempForecast[i].$));
          weather.forecast.temperature = tempForecast[i].temperature[0].$.value;
          break;
        }
      }
      // legg til hele fila;  
      //weather.complete = result;

      console.log("ISOString" + weather.lastupdate.toISOString());
      weatherRef.doc(weather.lastupdate.toISOString()).set(weather);
      return res.send(weather);

    });


  })

});

function getDateNoTime(time) {
  time.from = new Date(time.from + "+02:00");
  time.to = new Date(time.to + "+02:00");
  return time;
}


