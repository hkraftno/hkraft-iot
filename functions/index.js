const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const request = require('request');

exports.decodeSensorData = functions.https.onRequest((req, res) => {

  console.log('decodeSensorData received [', req.method + ' ]: ' + req.body);

  if (req.method === 'POST') {
    var sensorData = req.body;
    if (typeof sensorData === "object")
      sensorData = JSON.stringify(sensorData);
    sensorData = JSON.parse(sensorData);
    const devEUI = sensorData.deveui;
    const doc = devEUI + '/' + sensorData.timestamp
    const sensorType = 'thy_lab_14ns';

    console.log('Posting for decoding: ', sensorData);

    request.get(`https://us-central1-hkraft-iot.cloudfunctions.net/parse_${sensorType}/${sensorData.payload}`
    }, (error, response, body) => {
      if (error !== null) {
        console.log('error:', error);
        return response.sendStatus(500);
      }
      console.log('json:', JSON.stringify(body));

      const firestoreRef = firestore.doc(doc);
      const item = {
        timestamp : new Date(sensorData.timestamp).toISOString(),
        battery_current_level: body.battery_level,
        temperature: body.temperature,
        humidity: body.humidity,
      };
      console.log('Legger inn:', item);
      firestoreRef.set(item).then(snapshot => { return console.log(item, "lagt inn i " + doc); })
        .catch(error => {
          console.log('error: ', error)
          return response.sendStatus(500);
        });
      return res.send(body);
    })
  }
  console.log('returning 405')
  return res.sendStatus(405);
});

exports.postSensorData = functions.https.onRequest((req, res) => {
  console.log('postSensorData received [', req.method + ' ]: ' + req.body);
  if (req.method === 'POST') {
    var request = req.body;
    if (typeof request === "object")
      request = JSON.stringify(request);
    request = request.replace(/([{,])(\s*)([A-Za-z0-9_-]+?)\s*:/g, '$1"$3":')
    request = request.replace(/'/g, '"');
    request = request.replace(/\[Object\]/g, '"[Object]"');
    console.log('postSensorData cleaned up JSON: ', request);
    var reqObj = JSON.parse(request);
    console.log('postSensorData object: ', reqObj);
    const firestoreRef = firestore.doc(`from_thingpark/${new Date(reqObj.DevEUI_uplink.Time).valueOf()}`);
    firestoreRef.set(reqObj).then(snapshot => { return console.log(reqObj, "lagt inn i from_thingpark"); })
      .catch(error => {
        console.log('error: ', error)
        return res.sendStatus(500);
      });
    console.log('returning 201')
    return res.sendStatus(201);
  } else {
    console.log('returning 405')
    return res.sendStatus(405);
  }
});

exports.sensorDataUpdate = functions.firestore
  .document('from_thingpark/{time}')
  .onCreate((snap, context) => {
    const sensorData = snap.data();
    console.log('sensorDataUpdate received:', sensorData)
    request.post(' https://us-central1-hkraft-iot.cloudfunctions.net/decodeSensorData', {
      json: {
        timestamp: new Date(sensorData.DevEUI_uplink.Time).valueOf(),
        payload: sensorData.DevEUI_uplink.payload_hex,
        port: sensorData.DevEUI_uplink.FPort,
        deveui: sensorData.DevEUI_uplink.DevEUI
      }
    }, (error, response, body) => {
      if (error !== null)
        console.log('the error:', error);
      return 0;
    })
  });
