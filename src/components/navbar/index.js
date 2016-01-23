import style from './style.styl';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      tabs: [
        { id: 'file', name: 'FILE' },
        { id: 'web', name: 'WEB' },
        { id: 'SERVICE', name: 'SERVICE' },
      ]
    }
  },
  methods: {
    selectTab: function(tabName) {
      // tabName = web || file || service
      this.dispatch('navTab:selected', tabName);
    }
  }
}
