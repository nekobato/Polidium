const ipcRenderer = require('electron').ipcRenderer;
import Vue from 'vue';

import style from './components/player/style.styl';

import VideoPlayer from './components/player/VideoPlayer.vue';
import WebView from './components/player/Webview.vue';
import config from './models/config';

new Vue({
  el: 'body',
  components: {
    VideoPlayer,
    Webview
  },
  data: {
    viewMode: 'video-player',
    clickThrough: true,
    config: config
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
    },
    'settings:change-opacity': function(opacity) {
      this.config.opacity = opacity;
    }
  },
  ready: function() {
    ipcRenderer.on('main:ipc-bridge', (event, channel, data) => {
      this.$emit(channel, data);
    });

    ipcRenderer.on('main:toggle-player', (event, flag) => {
      this.clickThrough = flag ? true : false;
      this.$broadcast('main:toggle-player', flag);
    });
  }
});
