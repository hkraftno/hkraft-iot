const functions = require('firebase-functions');

const admin = require('firebase-admin');
const BigQuery = require('@google-cloud/bigquery');

// Your Google Cloud Platform project ID
const projectId = 'hkraft-bade-anna';
var request = require('request');
var fastXmlParser = require('fast-xml-parser');
var parseString = require('xml2js').parseString;

admin.initializeApp(functions.config().firebase);

const samplesCollection = 'samples';

exports.addSamples = functions.pubsub.topic('hent-fra-anna').onPublish((event) => {
 const pubSubMessage = event.data;
  // Get the `name` attribute of the PubSub message JSON body.
  let name = null;
  try {
    var dataene = Object.assign(pubSubMessage.json, pubSubMessage.attributes)
    dataene.published = new Date(dataene.published_at);
    console.log("fra Bade-Anna",dataene);    
    return admin.firestore().collection(samplesCollection).doc().set(dataene);
  } catch (e) {
    console.error('PubSub message was not JSON', e);
  }
  return -1;
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref);
  });
});

//https://www.yr.no/sted/Norge/Rogaland/Haugesund/Eivindsvatnet/varsel.xml

exports.anna = functions.https.onRequest((req, res) => {
  try {
    console.log('body:', req.body);
    var ref = admin.firestore().collection('annaSettings').doc("settings");
    var getDoc = ref.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        return 0;
      } else {
        var dataene = doc.data();
        console.log('Document data:',dataene );
        res.send(dataene);
        return -1;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  
  } catch (e) {
    console.error(' error', e);
  }
  return -1;
  
});

exports.hentYr = functions.https.onRequest((req, res) => {
  console.log("Hent Værdata");
  request('https://www.yr.no/sted/Norge/Rogaland/Haugesund/Eivindsvatnet/varsel.xml', (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    //console.log('body:', body); // Print the JSON for the YR varsel.
    parseString(body, (err, result)=> {
        var weatherRef = admin.firestore().collection('weather-simple');
        //console.dir(result);
        if(err !== null)
          console.log(err);

        var weather = new Object();
        var dateTemp = result.weatherdata.meta[0].lastupdate[0] + "+02:00";
        console.log("dateTemp", dateTemp);
        console.log("dateTemp", Date.parse(dateTemp));
        weather.lastupdate=  new Date(dateTemp);
        weather.link= result.weatherdata.links[0].link[2].$.url;
        weather.symbol= result.weatherdata.forecast[0].tabular[0].time[0].symbol[0];
        weather.wind = result.weatherdata.forecast[0].tabular[0].time[0].windSpeed[0].$;
        weather.time = getDateNoTime(result.weatherdata.forecast[0].tabular[0].time[0].$);
        weather.temperature = result.weatherdata.forecast[0].tabular[0].time[0].temperature[0].$.value;
        var tempForecast = result.weatherdata.forecast[0].tabular[0].time;
        console.log("length" , tempForecast.length );
        for(var i = 0; i<tempForecast.length; i++){
          
            console.log("periode",tempForecast[i].$.period);
            if(tempForecast[i].$.period === "3")
            {
              weather.forecast = new Object();
              console.log("YEAH");
              weather.forecast.symbol= tempForecast[i].symbol[0];
              weather.forecast.wind = tempForecast[i].windSpeed[0].$;
              weather.forecast.time = getDateNoTime(tempForecast[i].$);
              weather.forecast.temperature = tempForecast[i].temperature[0].$.value;

              if((new Date(weather.time.from)).setHours(0,0,0,0) === (new Date(weather.forecast.time.from)).setHours(0,0,0,0)){
                console.log("samme dag");
                weather.forecast.sameDay=true;
              }
              else{
                weather.forecast.sameDay=false;
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

exports.hentData = functions.https.onRequest((req, res) => {
  console.log("justerData");
  //const result = await admin.firestore().collection(samplesCollection).orderBy("published_at", "desc").limit(10).get();
  var ref = admin.firestore().collection(samplesCollection);
  var p = 0;
  var i = 0;
  var startD = new Date("2019-01-13T17:00:38.215Z");
  //var endD = new Date("2018-05-16T00:00:38.215Z");
  //var query = ref.where("published",">",startD).where("published","<",endD).orderBy("published", "desc").get()
  var query = ref.where("published",">",startD).orderBy("published", "desc").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
          var data = doc.data();
         console.log("data", data);
         // console.log("data1",data.published_at);
          //data.published = new Date(data.published_at);
         // console.log("data ", data.published);
         // console.log("id ", doc.id);
       //   ref.doc(doc.id).delete();
          if (p > 50){
            console.log("antall logget ", i, " dato: " , data.published);
            p=0;
          }
          p++;
          i++;
        });
        return res.sendStatus(200);
      })
    .catch(err => {
        console.log('Error getting documents', err);
    });
});


exports.justerData = functions.https.onRequest((req, res) => {
  console.log("justerData");
  //const result = await admin.firestore().collection(samplesCollection).orderBy("published_at", "desc").limit(10).get();
  var ref = admin.firestore().collection(samplesCollection);
  var p = 0;
  var i = 0;
  var startD = new Date("2018-05-16T19:30:38.215Z");
  var endD = new Date("2018-05-16T20:39:38.215Z");
  var query = ref.where("published",">",startD).orderBy("published", "desc").get()
  //var query = ref.where("published",">",startD).where("published","<",endD).orderBy("published", "desc").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
          var data = doc.data();
         console.log("data", data);

         //Justere
         // console.log("data1",data.published_at);
          //data.published = new Date(data.published_at);
         // console.log("data ", data.published);
         // console.log("id ", doc.id);
         
         //slette
         //ref.doc(doc.id).delete();

          if (p > 50){
            console.log("antall logget ", i, " dato: " , data.published);
            p=0;
          }
          p++;
          i++;
        });
        return res.sendStatus(200);
      })
    .catch(err => {
        console.log('Error getting documents', err);
    });



  
});

exports.exportBigQuery = functions.https.onRequest((req, res) => {
  console.log("BigQuery");

  let bigquery = new BigQuery();
  let datasetName="badetemperatur";
  let tableName = "sample";
  
  let table =   bigquery.dataset(datasetName).table(tableName);

  var ref = admin.firestore().collection(samplesCollection);
  var p = 0;
  var i = 0;
  var startD = new Date("2018-06-06T09:30:38.215Z");
  var endD = new Date("2018-05-01T20:39:38.215Z");
  var query = ref.where("published",">",startD).orderBy("published", "desc").get()
  //var query = ref.where("published",">",startD).where("published","<",endD).orderBy("published", "desc").get()
    .then(snapshot => {
      var rows = [];
        snapshot.forEach(doc => {
          var data = doc.data();
         console.log("data", data);

         //Justere
         // console.log("data1",data.published_at);
          data.published = new Date(data.published_at);
         // console.log("data ", data.published);
         // console.log("id ", doc.id);
         
         //slette
         //ref.doc(doc.id).delete();
      //   ----------------------------------
      const datetime = BigQuery.datetime(data.published_at); 
        let row = {
          
           device:data.device_id,
           temperature: data.tw,
           power:data.p,
           timestamp: datetime
       }
       rows.push(row);

         console.log("antall" + i,data.published);

          if (p > 50){
            console.log("antall logget ", i, " dato: " , data.published);
            p=0;
          }
          p++;
          i++;
        });
       // table.insert(rows)
       //  .then(() => {
       //    console.log(`Inserted  rows`, rows.length);
       //    return 0; 
       //  })
       //  .catch(err => {
       //    console.log('Error getting documents', err);
       //  })
       
        return res.send(rows.length + "rader lagt til");
      })
    .catch(err => {
        console.log('Error getting documents', err);
    });


});



exports.lastupdated = functions.https.onRequest((req, res) => {
  console.log("lastupdated");
  console.log(req.query.client);
  var query = admin.firestore().collection(samplesCollection).orderBy("published_at", "desc").limit(1).get()
  //var query = ref.where("published",">",startD).where("published","<",endD).orderBy("published", "desc").get()
    .then(snapshot => {
      var lastUpdated = new Object();
        snapshot.forEach(doc => {
          var data = doc.data();
          console.log("data", data);
          
          lastUpdated.updated=data.published;
          lastUpdated.temperature = data.tw;
          lastUpdated.location="Eivindsvatnet";
          
        });
        return res.status(200).json(lastUpdated);
        //return res.sendStatus(200);
      })
    .catch(err => {
        console.log('Error getting documents', err);
    });

});


exports.sampleToBigQ = functions.firestore
  .document("/samples/{sampleID}")
  .onCreate(event => {
    console.log("Data",event.data.data() );
    var data = event.data.data();
    let bigquery = new BigQuery();
    let datasetName="badetemperatur";
    let tableName = "sample";

    const datetime = BigQuery.datetime(data.published_at);
    let table =   bigquery.dataset(datasetName).table(tableName);
    let row = {
            
      device:data.device_id,
      temperature: data.tw,
      power:data.p,
      timestamp: datetime
    }

    table.insert(row)
    .then(() => {
      console.log(`Inserted  rows`, row);
      return 0; 
    })
    .catch(err => {
      console.log('Error getting documents', err);
    })

  });

function getDateNoTime(time){
  time.from = new Date(time.from+"+02:00");
  time.to = new Date(time.to+"+02:00");
 return time;
}

function getSettings()
{
  var ref = admin.firestore().collection('annaSettings').doc("settings");
    var getDoc = ref.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        var dataene = new Object() ;
        dataene.waitfor = 60*30;
        dataene.awake= 0;
        return dataene;
      } else {
        var frabasen = doc.data();
        console.log('Document data:',frabasen );
        
        return frabasen;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
}

