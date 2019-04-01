const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const rp = require('request-promise-native');

// DevEUI: parserUrl
const sensors = {
  '70B3D580A010638B': 'https://us-central1-hkraft-iot.cloudfunctions.net/parse_thy_lab_xxns',
  '70B3D580A0106438': 'https://us-central1-hkraft-iot.cloudfunctions.net/parse_pul_lab_xxns',
  '70B3D580A010344E': 'https://us-central1-hkraft-iot.cloudfunctions.net/parse_pir_lab_xxns',
  '70B3D580A0104DA8': 'https://us-central1-hkraft-iot.cloudfunctions.net/parse_tem_lab_xxns',
  '70B3D580A0106436': 'https://us-central1-hkraft-iot.cloudfunctions.net/parse_tor_lab_xxns',
  '70B3D580A010642B': 'https://us-central1-hkraft-iot.cloudfunctions.net/parse_tor_lab_xxns',
};

exports.postSensorData = functions.https.onRequest((req, res) => {
  console.log('postSensorData received [', req.method, ']:', JSON.stringify(req.body));
  if (req.method === 'POST') {
    const uplink = req.body.DevEUI_uplink;
    const ts = new Date(uplink.Time).toISOString();
    const fromThingparkRef = firestore.doc(`from_thingpark/${ts}-${uplink.DevEUI}`);
    const measurementRef = firestore.doc(`sensors/lora/${uplink.DevEUI}/${ts}`);
    if (!sensors[uplink.DevEUI]){
      return res.status(404).send(`There doesn't exist a parser for DevEUI ${uplink.DevEUI}`);
    }
    return fromThingparkRef
    .set(req.body)
    .then(() => console.log('Stored data from thinkpark: OK'))
    .then(() => rp.get(`${sensors[uplink.DevEUI]}/${uplink.payload_hex}`))
    .then(response => JSON.parse(response))
    .then(parsed => Object.assign(parsed, {timestamp: ts, coordinates: uplink.CustomerData.loc}))
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

exports.updateLatest = functions.firestore
.document(`sensors/lora/{sensorId}/{time}`)
.onCreate((snap, context) =>
  firestore
  .doc(`latest/${context.params.sensorId}`)
  .set(snap.data())
  .then(() => console.log(`Updated 'latest/${context.params.sensorId}' to point to newest measurement`))
);
