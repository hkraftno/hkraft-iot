import db from '../firebase.js';
import {round} from '../my_math.js';

export default {
  template: `<section id="chart" class="section">
  <h1>Temperatures for sensor {{id}}</h1>
  <line-chart v-if="chartData" v-bind:chartData="chartData" v-bind:options="chartOptions"></line-chart>
  </section>`,
  data() {
    return {
      id: this.$route.params.id,
      chartData: undefined,
      chartOptions: {
        title: {
          text: 'Chart.js Time Scale'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                hour: 'HH:mm',
                day: 'DD MMM', //TODO doesn't work
              }
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero:false
            },
            afterTickToLabelConversion : function(q){
              for(var tick in q.ticks){
                q.ticks[tick] += '\u00B0C';
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (item, data) => round(item.yLabel) + '\u00B0C',
            title: (item, data) => formatDateTime(item[0].xLabel),
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    };
  },
  created() {
    db
    .collection('sensors/lora/' + this.$route.params.id)
    .orderBy("timestamp", "desc")
    .limit(30)
    .onSnapshot(querySnapshot => {
      const temperatures = querySnapshot
      .docs
      .map(doc => doc.data());
      this.chartData = {
        datasets: [{
          label: "Temperatur",
          fill: false,
          data: temperatures.map(t => ({x: new Date(t.timestamp), y: t.temperature})),
          // Add `borderColor: ['grey',],` to change line color 
        }],
      };
    });
  },
  methods: {
    round,
  }
}

function formatDateTime(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, 0);
  const day = date.getDate().toString().padStart(2, 0);
  const hours = date.getHours().toString().padStart(2, 0);
  const minutes = date.getMinutes().toString().padStart(2, 0);
  return `${year}-${month}-${day} kl ${hours}:${minutes}`;
}
