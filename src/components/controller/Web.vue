<template lang="jade">
div.web-wrapper.white
  div.encoded-url
    span.grey-text {{encodedURL}}
  form(@submit.prevent='onSubmitURL')
    div.input-field
      input#url_input(type='text' placeholder='URL' v-model='url' @keydown.86="onTryPasteClipboard")


</template>

<script>
const ipcRenderer = require('electron').ipcRenderer
const clipboard = require('electron').clipboard
const xss = require('xss')

export default {
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
</script>

<style lang="stylus">
.web-wrapper
  padding: 6px 0
  height: 74px
  border-radius: 5px
  .input-field
    margin-left: 1rem
    margin-right: 1rem
.encoded-url
  position: absolute
  margin: auto
  left: 1rem
</style>
