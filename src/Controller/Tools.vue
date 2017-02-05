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
  div.center.exit
    div.btn.red(@click="closeApplication")
      i.material-icons.left close
      span quit Polidium
</template>
<script>
const { ipcRenderer } = require('electron')
const types = require('../mutation-types')

module.exports = {
  name: 'settings',
  data () {
    return {
      opacity: 0.05
      // settings: ipcRenderer.sendSync(types.SETTINGS_CONNECT)
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings
    }
  },
  methods: {
    onChangeOpacityRange () {
      // ipcRenderer.send('EMIT', types.CHANGE_OPACITY, this.settings.opacity)
      this.$store.commit(types.CHANGE_OPACITY, this.$data.opacity)
    },
    toggleClickThrough () {
      ipcRenderer.send('EMIT', types.CHANGE_THROUGTH)
      this.settings.clickThrough = this.settings.clickThrough ? false : true
    },
    closeApplication () {
      ipcRenderer.send(types.EXIT)
    },
    selectDisplay (display) {
      ipcRenderer.send('EMIT', types.SELECT_DISPLAY, display)
    }
  },
  created () {
    // ipcRenderer.on('INIT_SETTINGS', (settings) => {
    //   this.settings = settings
    // })
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
