import template from './template.jade';

import config from 'models/config';

export default {
  template: template(),
  data: function() {
    return {
      src: "",
      controls: false,
      config: config
    }
  },
  events: {
    'player:receive-url': function(url) {
      this.src = url
    }
  }
}
