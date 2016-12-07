<template lang="jade">
webview.webview(nodeintegration
  v-bind="{ src: src }"
  v-bind:style="{ opacity: config.opacity / 100 }")
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer

export default {
  data: function() {
    return {
      src: "",
      controls: false,
      config: config
    }
  },
  events: {
    'player:receive-url': function(url) {
      this.src = url
    }
  }
}
</script>
