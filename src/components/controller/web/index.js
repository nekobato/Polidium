const ipcRenderer = require('electron').ipcRenderer
const clipboard = require('electron').clipboard
const xss = require('xss')

import style from './style.styl'

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      url: ''
    }
  },
  computed: {
    encodedURL: function() {
      let encodedURL = this.$data.url
      console.log(encodedURL)
      if ( !encodedURL.match(/https?\:\/\//) ) encodedURL = 'http://' + encodedURL
      encodedURL = xss(encodedURL)
      return encodedURL
    }
  },
  events: {
    'URL_SUBMITTED': function() {
      if (! this.encodedURL.match(/^https?(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/) ) {
        return false
      }
      ipcRenderer.send('controller:ipc-bridge', 'url:submit-url', this.encodedURL)
    }
  },
  methods: {
    onSubmitURL: function() {
      this.$emit('URL_SUBMITTED')
    },
    onTryPasteClipboard: function(e) { // for only Mac
      if (e.metaKey !== true) return
      e.preventDefault()

      this.url = clipboard.readText()
    }
  },
  ready: function() {
  }
}
