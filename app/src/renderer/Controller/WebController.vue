<template lang="jade">
div.web
  form(@submit.prevent='submitURL')
    div.input-field
      input#url_input(type='text' placeholder="URL" v-model='url' @keydown.86="tryPasteClipboard")
      label(for="url_input") {{encodedURL}}
  div.row.click-through
    div.col.s6.no-padding
      span.grey-text Player ClickThrough is
    div.col.s6.no-padding
      div.switch
        label
          span Off
          input(type="checkbox", v-model="clickThrough")
          span.lever
          span On
</template>
<script>
const ipc = require('renderer/ipc')
const { clipboard } = require('electron')
const xss = require('xss')
const types = require('root/mutation-types')

module.exports = {
  name: 'WebController',
  data () {
    return {
      url: ''
    }
  },
  computed: {
    encodedURL () {
      let encodedURL = this.$data.url
      if ( !encodedURL.match(/https?\:\/\//) ) encodedURL = 'http://' + encodedURL
      encodedURL = xss(encodedURL)
      return encodedURL
    },
    clickThrough: {
      get () {
        return this.$store.state.settings.player.clickThrough
      },
      set (value) {
        console.log(value)
        ipc.commit(types.SET_CLICKTHROUGH, { clickThrough: value })
      }
    },
  },
  methods: {
    submitURL () {
      if (! this.encodedURL.match(/^https?(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/) ) {
        return false
      }
      ipc.commit('URL_SUBMITTED', this.encodedURL)
    },
    tryPasteClipboard (e) { // for Mac
      if (e.metaKey !== true) return
      this.url = clipboard.readText()
    }
  }
}
</script>
<style lang="stylus" scoped>
.web
  padding: 20px
.input-field
  label
    top: -0.8rem
.click-through
  padding-top: 20px
.switch
  text-align: center
</style>
