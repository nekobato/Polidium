const ipcRenderer = require('electron').ipcRenderer;
import Vue from 'vue';

import style from './components/player/style.styl';

import videoPlayer from './components/player/video-player';

window.app = new Vue({
  el: 'body',
  components: {
    'video-player': videoPlayer
    // 'web-player': webPlayer // TODO
  },
  data: {
    viewMode: 'video-player'
  },
  events: {
    'player:receive-file': function(files) {
      this.playMode = 'video'
    },
    'web:get': function(url) {
      this.playMode = 'web'
      this.player.src= url
    },
    'controller:toggle': function() {
      this.player.controls = this.player.controls ? false : true;
    }
  },
  ready: function() {
    ipcRenderer.on('filer:select-file', (event, fileStr) => {
      console.log(fileStr);
      let file = JSON.parse(fileStr);
      console.log(file);
      this     .$emit('player:receive-file', file);
      this.$broadcast('player:receive-file', file);
    });
  }
});
