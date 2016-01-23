import style from './style.styl';
import filer from '../filer';
import navbar from '../navbar';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      show: true
    }
  },
  components: {
    navbar: navbar,
    filer: filer
  },
  events: {
    'controller:toggle': function() {
      this.toggle();
    },
    'navTab:selected': function(tabName) {
      // TODO anything
    }
  },
  methods: {
    toggle: function() {
      this.show = this.show ? false : true;
    }
  }
}
