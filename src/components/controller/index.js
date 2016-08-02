import Vue from 'vue';

import navbar from './navbar';
import playlist from './Playlist/Playlist.vue';
import web from './web';
import settings from './settings';

import style from './style.styl';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      show: true,
      currentView: 'playlist'
    }
  },
  components: {
    navbar,
    playlist,
    web,
    settings
  },
  events: {
    'navTab:selected': function(tab) {
      this.show = false;
      this.currentView = tab.id;
      this.$nextTick(function() {
        this.show = true;
      });
    }
  },
  methods: {
  }
}
