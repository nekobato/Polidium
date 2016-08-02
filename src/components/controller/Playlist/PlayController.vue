<template lang="jade">
div.grey.lighten-1.controller
  div.btn-floating.control-button
    i.material-icons skip_previous
  div.btn-floating.control-button.play-button
    i.material-icons play_arrow
    //- i.material-icons pause
  div.btn-floating.control-button
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%
  height: 100%
.control-button
  margin: 4px
.play-button
  width: 48px
  height: 48px
  & > .material-icons
    line-height: 48px
</style>
