import template from './template.jade';

export default {
  template: template(),
  data: function() {
    return {
      src: "",
      controls: false
    }
  },
  events: {
    'player:receive-url': function(url) {
      this.src = url
    }
  }
}
