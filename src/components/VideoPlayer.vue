<template lang="jade">
video.video-player(autoplay
  v-bind='{ controls: controls, src: src }'
  v-bind:style="{ opacity: config.opacity / 100 }")
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer

export default {
  data: function() {
    return {
      src: null,
      controls: false
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
