const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const rp = require('request-promise-native');

class MissingParserError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.message = "There doesn't exist a parser for DevEUI " + message;
  }
}

exports.postSensorData = functions.https.onRequest((req, res) => {
  console.log(
    'postSensorData received [',
    req.method,
    ']:',
    JSON.stringify(req.body)
  );
  if (req.method === 'POST') {
    const uplink = req.body.DevEUI_uplink;
    const ts = new Date(uplink.Time).toISOString();
    const coordinates = {
      lat: Number(uplink.CustomerData.loc.lat),
      lng: Number(uplink.CustomerData.loc.lon)
    };
    const fromThingparkRef = firestore.doc(
      `from_thingpark/${ts}-${uplink.DevEUI}`
    );
    const measurementRef = firestore.doc(`sensors/lora/${uplink.DevEUI}/${ts}`);

    return fromThingparkRef
      .set(req.body)
      .then(plog('Stored data from thinkpark: OK'))
      .then(plog(`Getting parser for DevEUI ${uplink.DevEUI}`))
      .then(() => getSensorParser(uplink.DevEUI))
      .then((parser) => rp.get(`${parser.parserURL}/${uplink.payload_hex}`))
      .then(JSON.parse)
      .then((parsed) =>
        Object.assign(parsed, { timestamp: ts, coordinates: coordinates })
      )
      .then((parsed) => measurementRef.set(parsed))
      .then(plog('Stored parsed payload: OK'))
      .then(() => res.sendStatus(201))
      .catch((error) => {
        if (error instanceof MissingParserError) {
          console.warn('Warn:', error.message);
          return res.status(204).send(error.message);
        }
        console.error('Error:', error.message);
        return res.status(500).send(error.message);
      });
  } else {
    return res.sendStatus(405);
  }
});

exports.updateLatest = functions.firestore
  .document(`sensors/lora/{sensorId}/{time}`)
  .onCreate((snap, context) => {
    if (context.params.sensorId !== 'parsers') {
      firestore
        .doc(`latest/${context.params.sensorId}`)
        .set(snap.data())
        .then(() =>
          console.log(
            `Updated 'latest/${
              context.params.sensorId
            }' to point to newest measurement`
          )
        )
        .catch((err) =>
          console.log(`Got error when updating latest: ${err.message}`)
        );
    }
  });

exports.postDisruptiveData = functions.https.onRequest((req, res) => {
  console.log(
    req.body.labels && req.body.labels.name
      ? `${req.body.labels.name}`
      : 'Melding mottatt'
  );
  if (
    req.method === 'POST' &&
    req.body &&
    req.body.event &&
    ['touch', 'temperature', 'objectPresent'].includes(req.body.event.eventType)
  ) {
    const event = req.body.event;
    const doc = firestore.doc(`disruptive_${event.eventType}/${event.eventId}`);
    const document_result = doc.set(req.body);
    return res.status(200).send(document_result);
  } else {
    return res.status(405);
  }
});

function getSensorParser(DevEUI) {
  return firestore
    .collection('sensors/lora/parsers')
    .where('DevEUIs', 'array-contains', DevEUI)
    .get()
    .then((query) => {
      if (query.docs.length === 0) {
        throw new MissingParserError(DevEUI);
      } else if (query.docs.length > 1) {
        throw new Error(
          `There are more than one parser that matches the DevEUI ${DevEUI}: ${query.docs.map(
            (s) => s.id
          )}`
        );
      }
      return query.docs[0].data();
    })
    .catch((error) => {
      throw new Error(
        `Got error when trying to get parser from firestore: ${error.message}`
      );
    });
}

function plog(message) {
  return function(promiseArgument) {
    console.log(message);
    return promiseArgument;
  };
}
