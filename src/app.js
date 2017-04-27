import counter from './counter';
import radarOptions from '../data/radar';

const app = new Vue({
  el: '#app',
  components: {
    counter,
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