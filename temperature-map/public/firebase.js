firebase.initializeApp({
  apiKey: "AIzaSyDsc_zHjHKfybMaVvxrvefHQfM37t0sNFk",
  authDomain: "hkraft-iot.firebaseapp.com",
  databaseURL: "https://hkraft-iot.firebaseio.com",
  projectId: "hkraft-iot",
  storageBucket: "hkraft-iot.appspot.com",
  messagingSenderId: "444770432477"
});
const db = firebase.firestore();

export default db
