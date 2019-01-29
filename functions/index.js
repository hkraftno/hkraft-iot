const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const rp = require('request-promise-native');

// DevEUI --> sensorType
const sensorMap = {
  '70B3D580A010638B': 'thy_lab_14ns',
};

exports.postSensorData = functions.https.onRequest((req, res) => {
  console.log('postSensorData received [', req.method, ']:', JSON.stringify(req.body));
  if (req.method === 'POST') {
    const uplink = req.body.DevEUI_uplink;
    const ts = new Date(uplink.Time).toISOString();
    const fromThingparkRef = firestore.doc(`from_thingpark/${ts}`);
    const measurementRef = firestore.doc(`${uplink.DevEUI}/${ts}`);
    if (!sensorMap[uplink.DevEUI]){
      return res.status(404).send(`There doesn't exist a parser for DevEUI ${uplink.DevEUI}`);
    }
    return fromThingparkRef
    .set(req.body)
    .then(() => console.log('Stored data from thinkpark: OK'))
    .then(() => rp.get(`https://us-central1-hkraft-iot.cloudfunctions.net/parse_${sensorMap[uplink.DevEUI]}/${uplink.payload_hex}`))
    .then(response => JSON.parse(response))
    .then(parsed => Object.assign(parsed, {timestamp: ts}))
    .then(parsed => measurementRef.set(parsed))
    .then(() => console.log('Stored parsed payload: OK'))
    .then(() => res.sendStatus(201))
    .catch(error => {
      console.log('Error:', error);
      return res.status(500).send(error);
    })
  } else {
    return res.sendStatus(405);
  }
});
