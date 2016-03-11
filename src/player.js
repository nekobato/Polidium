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
      this.playMode = 'video-player';
      this.$broadcast('player:receive-file', file);
    },
    'url:submit-url': function(url) {
      console.log(url);
      this.playMode = 'webview';
      this.$broadcast('player:receive-url', url);
    }
  },
  ready: function() {
    ipcRenderer.on('main:ipc-bridge', (event, channel, data) => {
      console.log(channel, data);
      this.$emit(channel, data);
    });
  }
});
