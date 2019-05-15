/* global VueChartJs:false */
export default Vue.component('line-chart', {
  extends: VueChartJs.Line,
  props: ['chartData', 'options'],
  mixins: [VueChartJs.mixins.reactiveProp],
  mounted () {
    this.addPlugin({
      beforeDraw: function(c) {
        const data = c.data.datasets[0].data;
        const meta = c.data.datasets[0]._meta[0] || c.data.datasets[0]._meta[1];
        for (const index in data) {
          if (!meta) {
            return;
          }
          const point = meta.data[index]._model;
          if (data[index].y > 0) {
            point.backgroundColor = point.borderColor = '#FF0033';
          } else {
            point.backgroundColor = point.borderColor = '#0073B1';
          }
        }
      }
    });
    this.renderChart(this.chartData, this.options)
  },
});
