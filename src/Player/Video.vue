<template lang="jade">
video.video-player(autoplay
  v-bind="{ controls: video.controls, src: video.src }")
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer

export default {
  computed: {
    video () {
      return this.$store.state.video
    }
  }
}
</script>
<style lang="stylus" scoped>
.video-player
  width: 100%
  height: 100%
</style>
