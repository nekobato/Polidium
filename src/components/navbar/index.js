import style from './style.styl';

export default {
  template: require('./template.jade')(),
  methods: {
    selectTab: function(tabName) {
      // tabName = web || file || service
      this.dispatch('navTab:selected', tabName);
    }
  }
}
