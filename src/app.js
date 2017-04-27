import radar from '../lib/radar';
import counter from './counter';
import radarOptions from '../data/radar';

const app = new Vue({
  template: `<radar :data="data" :options="options"></radar>`,
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