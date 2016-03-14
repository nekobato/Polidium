const ipcRenderer = require('electron').ipcRenderer;
const clipboard = require('electron').clipboard;

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
    },
    onTryPasteClipboard: function(e) { // for only Mac
      if (e.metaKey !== true) return;
      e.preventDefault();

      this.url = clipboard.readText();
    }
  },
  ready: function() {
  }
}
