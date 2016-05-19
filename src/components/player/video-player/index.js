import template from './template.jade';

import config from 'models/config';

export default {
  template: template(),
  data: function() {
    return {
      src: null,
      controls: false,
      config: config
    }
  },
  events: {
    'player:receive-file': function(file) {
      this.src = file.path;
    },
    'main:toggle-player': function(clickThrough) {
      this.$data.controls = !clickThrough;
      console.log(this.$data.controls);
    }
  }
}
