<template lang="jade">
video.video-player(autoplay
  v-bind='{ controls: controls, src: src }'
  v-bind:style="{ opacity: config.opacity / 100 }")
</template>

<script>
export default {
  data: function() {
    return {
      src: null,
      controls: false,
    }
  },
  events: {
    'player:receive-file': function(file) {
      this.src = file.path;
    },
    'main:toggle-player': function(clickThrough) {
      this.$data.controls = !clickThrough;
      console.log(this.$data.controls);
    }
  }
}
</script>

<style lang="stylus">
</style>
