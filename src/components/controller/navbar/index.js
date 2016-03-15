const ipcRenderer = require('electron').ipcRenderer;

import style from './style.styl';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      tabs: [
        { id: 'filer', name: 'FILE', available: true },
        { id: 'web', name: 'WEB', available: false },
        { id: 'settings', name: 'SETTINGS', available: false }
      ]
    }
  },
  methods: {
    selectTab: function(tab) {
      // tabName = web || file || service
      this.$dispatch('navTab:selected', tab)
    },
    togglePlayer: function() {
      ipcRenderer.send('controller:toggle-player')
    }
  }
}
