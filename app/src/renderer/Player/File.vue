<template lang="jade">
video.video-player(autoplay v-bind="{ controls: controls, src: videoSource }")
</template>
<script>
module.exports = {
  name: 'video-player',
  computed: {
    queues () {
      return this.$store.state.video.queues
    },
    playPointer () {
      return this.$store.state.video.playPointer
    },
    controls () {
      return this.$store.state.video.controls
    },
    videoSource () {
      if (this.queues.length === 0) {
        return ''
      }
      return this.queues[this.playPointer].path
    }
  },
  created () {
    console.log(this)
  }
}
</script>
<style lang="stylus" scoped>
.video-player
  margin: 0
  width: 100%
  height: 100%
</style>
