import style from './style.styl';

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      url: ''
    }
  },
  events: {
  },
  methods: {
    onSubmitURL: function() {
      this.$dispatch('all', 'web:get', this.url);
    }
  },
  ready: function() {
  }
}
