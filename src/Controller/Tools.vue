<template lang="jade">
div.white.settings
  div.row
    div.input-field.center.opacity
      input#opacity_range.range.validate(type="range"
        v-model="opacity"
        @change="onChangeOpacityRange")
      label(for="opacity_range").label Opacity is {{ settings.opacity * 100 }}
      div.min-max.grey-text
        span.min 0
        span.max 100
  div.row.displays
    div.btn(v-for="(display, index) in settings.displays", @click="selectDisplay(index)")
      i.material-icons.left desktop_windows
      span {{ index + 1 }}
  div.row.resize
    div.btn(@click="resizePlayer")
      i.material-icons.left transform
      span resize player
  div.center.exit
    div.btn.red(@click="closeApplication")
      i.material-icons.left close
      span quit Polidium
</template>
<script>
const types = require('../mutation-types')

module.exports = {
  name: 'settings',
  data () {
    return {
      opacity: 0.05
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings
    }
  },
  methods: {
    onChangeOpacityRange () {
      this.$store.dispatch(types.CHANGE_OPACITY, this.$data.opacity)
    },
    toggleClickThrough () {
      this.$store.dispatch(types.CHANGE_THROUGTH)
    },
    closeApplication () {
      this.$store.dispatch(types.EXIT)
    },
    selectDisplay (display) {
      this.$store.dispatch(types.SELECT_DISPLAY, display)
    },
    resizePlayer () {
      this.$store.dispatch(types.RESIZE_PLAYER_MODE)
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
  .btn
    padding: 0 1rem
.exit
  position: absolute
  margin: auto
  bottom: 20px
  left: 0
  right: 0
</style>
