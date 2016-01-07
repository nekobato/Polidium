const renderer = require('electron').ipcRenderer
import Vue from 'vue';
import style from './style.styl';
import controller from './components/controller';
import player from './components/player';

new Vue({
  el: 'body',
  events: {
    'all': function(event_name, data) {
      this.$broadcast(event_name, data);
    }
  },
  components: {
    controller: controller,
    player: player,
  },
  ready: function() {
    renderer.on('controller:toggle', () => {
      this.$broadcast('controller:toggle');
    });
  }
});
