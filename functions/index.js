const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const request = require('request');

exports.hentBadetemperatur = functions.https.onRequest((req, res) => {
  console.log("Hent badetemperatur fra sensor");
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

    const userStatusFirestoreRef = firestore.doc(`${firmwareType}/${measures[0].timestamp}`);
    var item = {};
    item['timestamp'] = measures[0].timestamp;
    for (var i = 0; i < measures.length; i++) {
      var id = [measures[i].id];
      item[id] = measures[i].value;
    }
    console.log('Legger inn:', item);
    userStatusFirestoreRef.set(item).then(snapshot => { return console.log(item, "lagt inn i " + firmwareType); })
      .catch(error => { console.log('error: ', error) });
    return res.send(item);
  })
});

