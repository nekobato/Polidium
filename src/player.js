const ipcRenderer = require('electron').ipcRenderer;
import Vue from 'vue';

import style from './components/player/style.styl';

import videoPlayer from './components/player/video-player';
import webView from './components/player/webview';

window.app = new Vue({
  el: 'body',
  components: {
    'video-player': videoPlayer,
    'webview': webView
  },
  data: {
    viewMode: 'webview'
  },
  events: {
    'filer:select-file': function(fileStr) {
      let file = JSON.parse(fileStr);
      this.viewMode = 'video-player';
      this.$nextTick(function() {
        this.$broadcast('player:receive-file', file);
      });
    },
    'url:submit-url': function(url) {
      this.viewMode = 'webview';
      this.$nextTick(function() {
        this.$broadcast('player:receive-url', url);
      });
    }
  },
  ready: function() {
    ipcRenderer.on('main:ipc-bridge', (event, channel, data) => {
      this.$emit(channel, data);
    });
  }
});
