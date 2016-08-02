<template lang="jade">
div.grey.lighten-1.controller
  div.btn-floating
    i.material-icons skip_previous
  div.btn-floating.btn-large
    i.material-icons play_arrow
    //- i.material-icons pause
  div.btn-floating
    i.material-icons skip_next
  div.seekbar
    div.seektime
</template>

<script>
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const remote      = electron.remote

export default {
  data () {
    return {
    }
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
@require '~stylesheets/variable'

.controller
  width: 100%
  height: 60px
</style>
