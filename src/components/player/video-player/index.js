import template from './template.jade';
// import style from './style.styl';

export default {
  template: template(),
  data: function() {
    return {
      src: null,
      controls: false
    }
  },
  events: {
    'player:receive-file': function(file) {
      this.src = file.path
    },
    'controller:toggle': function() {
      this.controls = this.controls ? false : true;
    }
  }
}