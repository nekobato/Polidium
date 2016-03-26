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
    }
  }
}
