const renderer = require('electron').ipcRenderer
import Vue from 'vue';

import materializeCss from 'materialize-css/dist/css/materialize.min.css';
import style from './style.styl';

import controller from './components/controller';

new Vue({
  el: 'body',
  events: {
    'all': function(event_name, data) {
      this.$broadcast(event_name, data);
    }
  },
  components: {
    controller: controller
  },
  ready: function() {
    renderer.on('controller:toggle', () => {
      this.$broadcast('controller:toggle');
    });
  }
});
