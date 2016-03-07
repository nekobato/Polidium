const renderer = require('electron').ipcRenderer
import Vue from 'vue';

import style from './player/style.styl';

import videoPlayer from './components/player/video-player';

new Vue({
  el: 'body',
  comoponents: {
    'video-player': videoPlayer,
    // 'web-player': webPlayer // TODO
  },
  data: function() {
    return {
      player: {
        src: null,
        controls: false
      },
      playMode: 'web'
    };
  },
  events: {
    'files:get': function(files) {
      this.playMode = 'video'
      this.player.src = files.path
    },
    'web:get': function(url) {
      this.playMode = 'web'
      this.player.src= url
    },
    'controller:toggle': function() {
      this.player.controls = this.player.controls ? false : true;
    }
  },
  ready: function() {}
});
