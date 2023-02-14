<template>
  webview.web-player(nodeintegration v-bind="{ src: web.src }")
</template>
<script lang="ts">
module.exports = {
  name: "web-player",
  computed: {
    web() {
      return this.$store.state.web;
    },
  },
};
</script>
<style lang="scss" scoped>
.web-player
  width: 100%
  height: 100%
  background: transparent
</style>
