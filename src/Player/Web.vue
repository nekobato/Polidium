<template lang="jade">
webview.webview(nodeintegration v-bind="{ src: web.src }")
</template>
<script>
const { ipcRenderer } = require('electron')

export default {
  computed: {
    web () {
      return this.$store.state.web
    }
  }
}
</script>
