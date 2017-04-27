import radar from '../lib/radar';
import radarOptions from '../data/radar';

const app = new Vue({
  template: `<div id="app">
    <radar :data="data" :options="options"></radar>
  </div>`,
  components: {
    radar,
  },
  data: function () {
    return {
      data: radarOptions.data,
      options: radarOptions.config,
    }
  },
});


if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}