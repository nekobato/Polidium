import template from './template.jade';
import style from './style.styl';

export default {
  template: template(),
  data: function() {
    return {
      player: {
        src: null
      }
    };
  },
  events: {
    'files:get': function(files) {
      this.$data.player.src = files[0].path
    }
  }
}
