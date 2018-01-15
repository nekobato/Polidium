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
          input(type="checkbox", :checked="clickThrough", @change="inputClickThrough")
          span.lever
          span On
  div.input-group
    div.btn.blue
      i.material-icons arrow_back
    div.btn.blue
      i.material-icons arrow_forward
    div.btn.blue
      i.material-icons refresh
</template>
<script>
import ipc from '@/lib/ipc'
import { clipboard } from 'electron'
import xss from 'xss'
import types from 'root/mutation-types'

export default {
  name: 'WebController',
  data () {
    return {
      url: ''
    }
  },
  computed: {
    encodedURL () {
      const encodedURL = this.$data.url.match(/^https?:\/\//g) ? this.$data.url : 'http://' + this.$data.url
      return xss(encodedURL)
    },
    clickThrough () {
      return this.$store.state.settings.player.clickThrough
    }
  },
  methods: {
    submitURL () {
      if (!this.encodedURL.match(/^https?(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)$/)) {
        return false
      }
      ipc.commit('OPEN_URL', { src: this.encodedURL })
    },
    tryPasteClipboard (e) { // for Mac
      if (e.metaKey !== true) return
      this.url = clipboard.readText()
    },
    inputClickThrough (e) {
      ipc.commit(types.SET_CLICKTHROUGH, { clickThrough: e.target.checked })
    }
  }
}
</script>
<style lang="stylus" scoped>
.web
  padding: 20px
.input-field
  label
    display: inline-block
    top: 3.5rem
    word-break: break-all
    max-height: 4.5rem
    overflow: hidden
.click-through
  padding-top: 4rem
.switch
  text-align: center
</style>
