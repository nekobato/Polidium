<template lang="jade">
div.player(:style="{ left: x, top: y, width: width, height: height, opacity: opacity }")
  component(:is="player.viewMode")
</template>
<script>
const { ipcRenderer } = require('electron')

import Video from './Video.vue'
import Web from './Web.vue'

export default {
  el: '#player',
  components: {
    Video,
    Web
  },
  computed: {
    player () {
      return this.$store.state.player
    },
    x () {
      return player.x ? player.x + 'px'
    },
    y () {
      return player.y ? player.y + 'px'
    },
    width () {
      return player.width ? player.width + 'px' : '100%'
    },
    height () {
      return player.height ? player.height + 'px' : '100%'
    },
    opacity () {
      return player.opacity ? player.opacity
    }
  },
  created () {
    ipcRenderer.on('BRIDGE', (event, channel, data) => {
      this.$store.dispatch(channel, data)
    })
  }
}
</script>
<style lang="stylus" scoped>
body,
html,
.player
  margin: 0
  width: 100%
  height: 100%

.player
  position: absolute
</style>
