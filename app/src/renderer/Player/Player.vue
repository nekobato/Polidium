<template lang="jade">
div.player(:style="playerStyle")
  component(:is="settings.mode")
</template>

<script>
const { ipcRenderer } = require('electron')
const VideoPlayer = require('./VideoPlayer.vue')
const WebPlayer = require('./WebPlayer.vue')

module.exports = {
  components: {
    'video-player': VideoPlayer,
    'web-player': WebPlayer
  },
  computed: {
    settings () {
      return this.$store.state.settings.player
    },
    playerStyle () {
      return {
        x: this.settings.x + 'px',
        y: this.settings.y + 'px',
        width: this.settings.width ? this.settings.width + 'px' : '100%',
        height: this.settings.height ? this.settings.height + 'px' : '100%',
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
</style>

<style lang="stylus" scoped>
.player
  margin: 0
  width: 100%
  height: 100%

.player
  position: absolute
</style>
