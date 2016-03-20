import template from './template.jade';
// import style from './style.styl';

export default {
  template: template(),
  data: function() {
    return {
      src: null,
      controls: false,
      styleObject: {
        opacity: 0.05
      }
    }
  },
  events: {
    'player:receive-file': function(file) {
      this.src = file.path;
    },
    'player:change-opacity': function(opacity) {
      console.log(opacity);
      this.styleObject.opacity = opacity / 100;
    }
  }
}
