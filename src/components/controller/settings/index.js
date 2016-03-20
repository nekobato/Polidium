const ipcRenderer = require('electron').ipcRenderer;

import style from './style.styl';
import configModel from 'models/config';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      config: configModel
    }
  },
  events: {
  },
  methods: {
    onChangeOpacityRange: function(e) {
      ipcRenderer.send('controller:ipc-bridge', 'settings:change-opacity', this.config.opacity);
    }
  }
}
