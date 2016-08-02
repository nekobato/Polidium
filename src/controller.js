const renderer = require('electron').ipcRenderer
import Vue from 'vue';
import Sortable from 'vue-sortable'

import materializeCss from 'materialize-css/dist/css/materialize.min.css';
import materialIcons from 'material-design-icons/iconfont/material-icons.css';

import controller from './components/controller';

// document全体へのDropを無視
document.ondragover = document.ondrop = function(e) {
  e.preventDefault()
  return false
}

Vue.use(Sortable)

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
  created: function() {
    renderer.on('controller:toggle', () => {
      this.$broadcast('controller:toggle');
    });
  }
});
