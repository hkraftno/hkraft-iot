import Firebase from '@firebase/app'
import '@firebase/firestore'
var config = {
    apiKey: "AIzaSyDsc_zHjHKfybMaVvxrvefHQfM37t0sNFk",
    authDomain: "hkraft-iot.firebaseapp.com",
    databaseURL: "https://hkraft-iot.firebaseio.com",
    projectId: "hkraft-iot",
    storageBucket: "hkraft-iot.appspot.com",
    messagingSenderId: "444770432477"
};

const fire = Firebase.initializeApp(config)

export const api = fire.firestore()
api.settings({timestampsInSnapshots: true})

export default fire

