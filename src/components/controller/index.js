import style from './style.styl';
import filer from '../filer';
import navbar from '../navbar';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      show: false
    }
  },
  components: {
    navbar: navbar,
    filer: filer
  },
  events: {
    'controller:toggle': function() {
      this.show = this.show ? false : true;
    },
    'navTab:selected': function(tabName) {
      // TODO anything
    }
  },
  methods: {
  }
}
