<template lang="jade">
div.player(:style="playerStyle")
  component(:is="settings.mode")
  resize-mode(v-show="settings.resizeMode")
</template>

<script>
const { ipcRenderer } = require('electron')
const VideoPlayer = require('./VideoPlayer.vue')
const WebPlayer = require('./WebPlayer.vue')
const ResizeMode = require('./ResizeMode.vue')

module.exports = {
  components: {
    'video-player': VideoPlayer,
    'web-player': WebPlayer,
    'resize-mode': ResizeMode
  },
  computed: {
    settings () {
      return this.$store.state.settings.player
    },
    playerStyle () {
      return {
        opacity: this.settings.opacity
      }
    }
  }
}
</script>

<style lang="stylus">
html,
body
  margin: 0
  width: 100%
  height: 100%
  overflow: hidden
  background: transparent
</style>

<style lang="stylus" scoped>
.player
  position: absolute
  margin: 0
  width: 100%
  height: 100%
  background: transparent
</style>
