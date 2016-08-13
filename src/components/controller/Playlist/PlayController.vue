<template lang="jade">
div.grey.lighten-1.controller
  div.btn-floating.control-button
    i.material-icons skip_previous
  div.btn-floating.teal.darken-1.control-button(@click="play")
    i.material-icons play_arrow
    //- i.material-icons pause
  div.btn-floating.control-button
    i.material-icons skip_next
  div.seek-bar.black
    div.seek-time.red.darken-1
    div.seek-handle.red.lighten-1
</template>

<script>
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const remote      = electron.remote
import { PLAY_QUEUE } from 'types'

export default {
  data () {
    return {
    }
  },
  methods: {
    play() {
      this.$dispatch(PLAY_QUEUE)
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
.control-button
  position: relative
  top: -8px
  margin: 4px
.seek-bar
  position: absolute
  bottom: 6px
  left: 6px
  right: 6px
  width: auto
  height: 10px
  text-align: left
.seek-time
  width: 10px
  height: 10px
.seek-handle
  position: absolute
  top: -5px
  left: 10px
  width: 10px
  height: 20px
</style>
