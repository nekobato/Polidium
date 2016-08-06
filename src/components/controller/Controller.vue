<template lang="jade">
div.controller(v-show="show")
  navbar
  component(:is="currentView")
</template>

<script>
import Vue from 'vue'

import Navbar from './Navbar.vue'
import Playlist from './Playlist/Playlist.vue'
import Web from './Web.vue'
import Settings from './Settings.vue'

export default {
  data: function() {
    return {
      show: true,
      currentView: 'playlist'
    }
  },
  components: {
    Navbar,
    Playlist,
    Web,
    Settings
  },
  events: {
    'navTab:selected': function(tab) {
      this.show = false
      this.currentView = tab.id
      this.$nextTick(function() {
        this.show = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@require "~stylesheets/variable"

body, html
  width: 100%
  height: 100%
  background-color: transparent

.controller
  position: absolute
  top: 10px
  bottom: 0
  margin: auto
  width: 100%
  background-color: #ffffff
  border-radius: 5px
  border: 3px solid #607d8b
</style>
