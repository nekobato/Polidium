<template lang="jade">
div.player(:style="{ left: x, top: y, width: width, height: height, opacity: opacity }")
  component(:is="player.mode")
</template>

<script>
const { ipcRenderer } = require('electron')

const FilePlayer = require('./File.vue')
const WebPlayer = require('./Web.vue')

module.exports = {
  components: {
    FilePlayer,
    WebPlayer
  },
  computed: {
    player () {
      return this.$store.state.player
    },
    x () {
      return this.player.settings.x + 'px'
    },
    y () {
      return this.player.settings.y + 'px'
    },
    width () {
      return this.player.settings.width ? this.player.settings.width + 'px' : '100%'
    },
    height () {
      return this.player.settings.height ? this.player.settings.height + 'px' : '100%'
    },
    opacity () {
      return this.player.settings.opacity
    }
  },
  created () {
    ipcRenderer.on('EMIT', (event, channel, data) => {
      this.$store.commit(channel, JSON.parse(data))
    })
    console.log(this.player)
  }
}
</script>

<style lang="stylus">
html,
body
  margin: 0
  width: 100%
  height: 100%
</style>

<style lang="stylus" scoped>
.player
  margin: 0
  width: 100%
  height: 100%

.player
  position: absolute
</style>
