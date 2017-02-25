<template lang="jade">
webview.web-player(nodeintegration v-bind="{ src: web.src }")
</template>
<script>
module.exports = {
  name: 'web-player',
  computed: {
    web () {
      return this.$store.state.web
    }
  }
}
</script>
<style lang="stylus" scoped>
.web-player
  width: 100%
  height: 100%
</style>
