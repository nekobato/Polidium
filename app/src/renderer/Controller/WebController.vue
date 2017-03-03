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
      const encodedURL = this.$data.url.match(/^https?\:\/\//g) ? this.$data.url : 'http://' + this.$data.url
      return xss(encodedURL)
    },
    clickThrough: {
      get () {
        return this.$store.state.settings.player.clickThrough
      },
      set (value) {
        ipc.commit(types.SET_CLICKTHROUGH, { clickThrough: value })
      }
    },
  },
  methods: {
    submitURL () {
      if (! this.encodedURL.match(/^https?(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/) ) {
        return false
      }
      ipc.commit('OPEN_URL', { src: this.encodedURL })
    }
  }
}
</script>
<style lang="stylus" scoped>
.web
  padding: 20px
.input-field
  label
    top: -2rem
    word-break: break-all
.click-through
  padding-top: 20px
.switch
  text-align: center
</style>
