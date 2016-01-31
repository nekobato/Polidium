const remote = require('remote');
const electron = remote.require('electron');

import template from './template.jade';
import style from './style.styl';

export default {
  template: template(),
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
      this.player.src = files[0].path
    },
    'web:get': function(url) {
      this.playMode = 'web'
      this.player.src= url
    },
    'controller:toggle': function() {
      this.player.controls = this.player.controls ? false : true;
    }
  }
}
