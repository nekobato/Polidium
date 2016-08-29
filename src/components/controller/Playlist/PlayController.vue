<template lang="jade">
div.blue-grey.lighten-5.controller
  div.btn-floating.control-button
    i.material-icons skip_previous
  div.btn-floating.teal.lighten-2.control-button(@click="play")
    i.material-icons play_arrow
    //- i.material-icons pause
  div.btn-floating.control-button
    i.material-icons skip_next
  div.seek-bar.black
    div.seek-time
    div.seek-handle.blue-grey.lighten-1
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
  methods: {
    play() {
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~stylesheets/variable'

.controller
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%
  border-radius: 5px
.control-button
  position: relative
  top: -12px
  margin: 4px
.seek-bar
  position: absolute
  bottom: 18px
  left: 8px
  right: 8px
  width: auto
  height: 8px
  text-align: left
  border-radius: 5px
.seek-time
  width: 100%
  height: 10px
  border-radius: 5px
.seek-handle
  position: absolute
  top: -4px
  left: 10px
  width: 16px
  height: 16px
  border-radius: 8px
  border: 1px solid #78909c
</style>
