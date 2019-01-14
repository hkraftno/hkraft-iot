import Firebase from '@firebase/app'
import '@firebase/firestore'
var config = {
  apiKey: "AIzaSyCfRDYtCnT6o7vlz70yBebTC9z__bhEtNU",
  authDomain: "hkraft-bade-anna.firebaseapp.com",
  databaseURL: "https://hkraft-bade-anna.firebaseio.com",
  projectId: "hkraft-bade-anna",
  storageBucket: "hkraft-bade-anna.appspot.com",
  messagingSenderId: "829772993587"
};

const fire = Firebase.initializeApp(config)

export const api = fire.firestore()
api.settings({timestampsInSnapshots: true})

export default fire

