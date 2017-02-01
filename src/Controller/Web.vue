<template lang="jade">
div.web
  form(@submit.prevent='submitURL')
    div.input-field
      input#url_input(type='text' placeholder='URL' v-model='url' @keydown.86="tryPasteClipboard")
  div.row.center
    span {{encodedURL}}
</template>
<script>
const { ipcRenderer, clipboard } = require('electron')
const xss = require('xss')

module.exports = {
  name: 'WebController',
  data () {
    return {
      url: ''
    }
  },
  computed: {
    encodedURL: function() {
      let encodedURL = this.$data.url
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
      ipcRenderer.send('controller:ipc-EMIT', 'url:submit-url', this.encodedURL)
    }
  },
  methods: {
    submitURL: function() {
      this.$emit('URL_SUBMITTED')
    },
    tryPasteClipboard: function(e) { // for Mac
      if (e.metaKey !== true) return
      this.url = clipboard.readText()
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
