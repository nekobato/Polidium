<template lang="jade">
video.video-player(autoplay
  v-bind='{ controls: controls, src: src }'
  v-bind:style="{ opacity: 0.5 }")
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
  },
  ready () {
    ipcRenderer.on('PLAY_FILE', (event, data) => {
      const file = JSON.parse(data)
      this.src = file.path
    })
  }
}
</script>
