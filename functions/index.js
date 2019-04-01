const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const rp = require('request-promise-native');

exports.postSensorData = functions.https.onRequest((req, res) => {
  console.log('postSensorData received [', req.method, ']:', JSON.stringify(req.body));
  if (req.method === 'POST') {
    const uplink = req.body.DevEUI_uplink;
    const ts = new Date(uplink.Time).toISOString();
    const coordinates = {lat: Number(uplink.CustomerData.loc.lat), lng: Number(uplink.CustomerData.loc.lon)}
    const fromThingparkRef = firestore.doc(`from_thingpark/${ts}-${uplink.DevEUI}`);
    const measurementRef = firestore.doc(`sensors/lora/${uplink.DevEUI}/${ts}`);
    const sensorParsersRef = firestore.doc('sensors/lora');

    return fromThingparkRef
    .set(req.body)
    .then(() => console.log('Stored data from thinkpark: OK'))
    .then(() => sensorParsersRef.get())
    .then(doc => doc.data())
    .then(sensors => {
      if (!sensors[uplink.DevEUI]){
        throw new Error(`There doesn't exist a parser for DevEUI ${uplink.DevEUI}`);
      }
      return sensors;
    })
    .then(sensors => rp.get(`${sensors[uplink.DevEUI]}/${uplink.payload_hex}`))
    .then(response => JSON.parse(response))
    .then(parsed => Object.assign(parsed, {timestamp: ts, coordinates: coordinates}))
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
