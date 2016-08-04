<template lang="jade">
webview.webview(nodeintegration
  v-bind="{ src: src }"
  v-bind:style="{ opacity: config.opacity / 100 }")
</template>

<script>
import config from 'models/config';

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

<style lang="stylus">
</style>
