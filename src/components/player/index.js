import template from './template.jade';
import style from './style.styl';

export default {
  template: template(),
  data: function() {
    return {
      player: {
        src: null,
        controls: false
      }
    };
  },
  events: {
    'files:get': function(files) {
      this.player.src = files[0].path
    },
    'controller:toggle': function() {
      this.player.controls = this.player.controls ? false : true;
    }
  }
}
