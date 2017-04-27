import Vue from 'vue';

const app = new Vue({
  template: '<div id="app">You have been here for <span>{{ counter }}</span> seconds.</div>',
    data: {
      counter: 0
    },
    created: function () {
      const vm = this;
      setInterval(() => {
        vm.counter += 1;
      }, 1000);
    }
});


if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}
else if (typeof window !== 'undefined') {
  window.app = app;
}