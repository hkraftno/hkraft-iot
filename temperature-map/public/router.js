import temperatureMap from './pages/temperature_map.js';
import temperatureGraph from './pages/temperature_graph.js';
import about_us from './pages/about_us.js';

export default new VueRouter({routes:[
    { path: "*", component: {template: '<h1>Page not found!</h1>'} },
    { path: '/', component: temperatureMap },
    { path: '/list-temperatures/:id', component: temperatureGraph },
    { path: '/about', component: about_us },
]});
