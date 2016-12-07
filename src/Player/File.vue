<template lang="jade">
video.video-player(autoplay v-bind="{ controls: video.controls, src: video.src }")
</template>
<script>
module.exports = {
  name: 'file',
  computed: {
    video () {
      return this.$store.state.video
    }
  }
}
</script>
<style lang="stylus" scoped>
.video-player
  margin: 0
  width: 100%
  height: 100%
</style>
