import db from '../firebase.js';
import gInit from '../google-maps-init.js';
import router from '../router.js';
import {round} from '../my_math.js';

export default {
  template: `<section class="section">
    <h1 class="title">Temperatur kart</h1>
    <p class="subtitle">
      Kart over sensorene til <strong>Hkraft</strong>!
    </p>
    <div id="map"></div>
  </section>`,
  mounted() {
    gInit()
    .then(() => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.410563, lng: 5.3906713},
        zoom: 10
      });

      onMapReady(map);
    });
  },
}

function onMapReady(map){
  const teardropIcon = {
    path: 'M41,20.4C41,31.7,20.5,63,20.5,63S0,31.7,0,20.4S9.2,0,20.5,0S41,9.1,41,20.4z',
    fillColor: '#ea4335',
    fillOpacity: 1,
    scale: 0.6,
    strokeColor: '#970909',
    strokeWeight: 2,
    anchor: new google.maps.Point(20.5, 63),
    labelOrigin: new google.maps.Point(20.5, 20.5),
  };
  let markers = [];
  let listeners = [];
  db
  .collection('latest')
  .where("temperature", "<", 9999)
  .onSnapshot(temps => {
    markers.forEach(marker => marker.setMap(null));
    listeners.forEach(listener => google.maps.event.removeListener(listener));
    markers = [];
    listeners = [];
    temps
    .docs
    .forEach(doc => {
      const marker = new google.maps.Marker({
        position: doc.data().coordinates,
        label: round(doc.data().temperature, 0).toString(),
        icon: teardropIcon,
        map: map,
      });
      markers.push(marker);
      listeners.push(marker
      .addListener('click', () => router.push('/list-temperatures/' + doc.id)));
    });
  });
}
