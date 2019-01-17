const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);
const request = require('request');

exports.decodeSensorData = functions.https.onRequest((req, res) => {
  console.log("decoding sensor payload");
  request.post('http://codec.slbase.io/SenlabH/decodeMessage', {
    json: {
      timestamp: '2019-01-14T08:23:15.695+01:00',
      payload: '03fd8e0c9c10000e5e',
      port: '3'
    }
  }, (error, response, body) => {
    if (error !== null)
      console.log('the error:', error);

    console.log('statusCode:', response && response.statusCode);

    var measures = body.measures;
    var firmwareType = body.firmwareType;

    const firestoreRef = firestore.doc(`${firmwareType}/${measures[0].timestamp}`);
    var item = {};
    item['timestamp'] = measures[0].timestamp;
    for (var i = 0; i < measures.length; i++) {
      var id = [measures[i].id];
      item[id] = measures[i].value;
    }
    console.log('Legger inn:', item);
    firestoreRef.set(item).then(snapshot => { return console.log(item, "lagt inn i " + firmwareType); })
      .catch(error => { console.log('error: ', error) });
    return res.send(item);
  })
});

exports.postSensorData = functions.https.onRequest((req, res) => {
  console.log('received', req.method);
  if (req.method === 'POST') {
    console.log('body:', req.body)
    reqBody = JSON.parse(req.body);
    const firestoreRef = firestore.doc(`sensordata/${new Date().valueOf()}`);
    console.log('Legger inn:', req.body);
    firestoreRef.set(reqBody).then(snapshot => { return console.log(reqBody, "lagt inn i sensordata"); })
      .catch(error => { console.log('error: ', error) });
  } else {
    console.log('returning 405')
    return res.sendStatus(405);
  }
  console.log('returning 201')
  return res.sendStatus(201);
});
