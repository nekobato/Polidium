import style from './style.styl';
import filer from '../filer';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      show: false
    }
  },
  components: {
    filer: filer
  },
  events: {
    'controller:toggle': function() {
      this.toggle();
    }
  },
  methods: {
    toggle: function() {
      this.show = this.show ? false : true;
    }
  }
}
