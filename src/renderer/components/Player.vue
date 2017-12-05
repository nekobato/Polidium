<template lang="jade">
div.player(:style="playerStyle")
  component(:is="settings.mode")
  resize-mode(v-show="settings.resizeMode")
</template>

<script>
import VideoPlayer from './Player/VideoPlayer.vue'
import WebPlayer from './Player/WebPlayer.vue'
import ResizeMode from './Player/ResizeMode.vue'

export default {
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
        opacity: this.settings.resizeMode ? 1 : this.settings.opacity,
        'pointer-events': this.settings.clickThrough ? 'none' : 'auto'
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
  width: 100%
  height: 100%
  background: transparent
</style>
