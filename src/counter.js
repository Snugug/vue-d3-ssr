export default {
  template: '<div>You have been here for <span>{{ counter }}</span> seconds.</div>',
  props: {
    counter: {
      type: Number,
      required: true,
    }
  },
  created() {
    const vm = this;
    setInterval(() => {
      vm.counter += 1;
    }, 1000);
  }
}
