<template lang="jade">
div.white.settings
  div.row
    div.input-field.center.opacity
      input#opacity_range.range.validate(type="range"
        v-model="opacity")
      label(for="opacity_range").label Opacity is {{ opacityFloor }}
      div.min-max.grey-text
        span.min 0
        span.max 100
  div.row.center.resize
    div.btn(@click="resizePlayer")
      i.material-icons.left transform
      span resize player
  div.row.center.disruptive
    div.btn.blue(@click="reload")
      i.material-icons.left refresh
      span reload
    div.btn.blue(@click="reset")
      i.material-icons.left settings_applications
      span reset settings
  div.row.center.disruptive
    div.btn.red(@click="quit")
      i.material-icons.left close
      span quit
</template>
<script>
const ipc = require('renderer/ipc')
const types = require('root/mutation-types')

module.exports = {
  name: 'settings',
  computed: {
    settings () {
      return this.$store.state.settings
    },
    opacity: {
      get () {
        return this.settings.player.opacity * 100
      },
      set (value) {
        ipc.commit(types.CHANGE_OPACITY, value / 100)
      }
    },
    opacityFloor () {
      return Math.floor(this.settings.player.opacity * 100)
    }
  },
  methods: {
    quit () {
      ipc.commit(types.QUIT)
    },
    reload () {
      ipc.commit(types.RELOAD)
    },
    reset () {
      ipc.commit(types.RESET)
    },
    selectDisplay (display) {
      ipc.commit(types.SELECT_DISPLAY, { display: display })
    },
    resizePlayer () {
      ipc.commit(types.RESIZE_PLAYER, { mode: true })
    }
  }
}
</script>
<style lang="stylus">
.settings
  padding: 20px
.opacity
  .label
    top: -1rem
  .min-max
    position: relative
    display: inline-block
    width: 100%
    height: 1rem
    top: -10px
  .min,
  .max
    position: absolute
  .min
    left: 0
  .max
    right: 0
.displays
  display: flex
  justify-content: space-between
  margin-bottom: 20px
  .btn
    padding: 0 1rem
.disruptive
  display: flex
  .btn
    margin: auto
    padding: 0 10px
    width: 120px
</style>
