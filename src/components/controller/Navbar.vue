<template lang="jade">
nav.navbar.blue-grey
  div.nav-wrapper
    ul
      li(v-for="tab in tabs" v-on:click="selectTab(tab)")
        a.blue-text.text-lighten-4 {{tab.name}}
</template>

<script>
const ipcRenderer = require('electron').ipcRenderer;

export default {
  data: function() {
    return {
      tabs: [
        { id: 'playlist', name: 'PLAYLIST', available: true },
        { id: 'web', name: 'WEB', available: false },
        { id: 'settings', name: 'SETTINGS', available: false }
      ]
    }
  },
  methods: {
    selectTab: function(tab) {
      // tabName = web || file || service
      this.$dispatch('navTab:selected', tab)
    }
  }
}
</script>

<style lang="stylus">
</style>
