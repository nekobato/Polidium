import Vue from 'vue';

import navbar from './navbar';
import filer from './filer';
import web from './web';

import style from './style.styl';

Vue.component('filer', filer);
Vue.component('web', web);

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      show: true,
      currentView: 'web'
    }
  },
  components: {
    navbar: navbar
  },
  events: {
    'controller:toggle': function() {
      this.show = this.show ? false : true;
    },
    'navTab:selected': function(tab) {
      this.currentView = tab.id;
    }
  },
  methods: {
  }
}
