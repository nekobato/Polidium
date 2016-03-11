const ipcRenderer = require('electron').ipcRenderer;

import style from './style.styl';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      url: ''
    }
  },
  events: {
  },
  methods: {
    onSubmitURL: function() {
      ipcRenderer.send('controller:ipc-bridge', 'url:submit-url', this.url);
    }
  },
  ready: function() {
  }
}
