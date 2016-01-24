import style from './style.styl';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      tabs: [
        { id: 'file', name: 'FILE', enabled: true },
        { id: 'web', name: 'WEB', enabled: false },
        { id: 'SERVICE', name: 'SERVICE', enabled: false },
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
