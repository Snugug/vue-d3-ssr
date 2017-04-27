import draw from '../lib/d3/radar';

export default {
  methods: {
    drawRadar() {
      const elem = document.createElement('div');
      const data = this.data;
      const options = this.options;

      return Vue.compile(draw(elem, data, options)).render;
    }
  },
  render: function(createElement) {
    if (this.chart) {
      return this.chart();
    }

    return this.drawRadar();
  },
  computed: {
    chart: function () {
      return this.drawRadar();
    }
  },
  watch: {
    data: function(val) {
      this.chart = this.drawRadar();
    },
    options: {
      handler: function(val) {
        this.chart = this.drawRadar();
      },
      deep: true,
    }
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },
};