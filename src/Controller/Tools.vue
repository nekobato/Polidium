<template lang="jade">
div.white.tools.container
  div.row
    h5 Opacity {{config.opacity}}
    div.input-field.center
      input#opacity_range.opacity-range.validate(type="range"
        v-model="settings.opacity"
        @change="onChangeOpacityRange")
      div.opacity-range
        span.min-range 0
        span.max-range 100
  div.divider
  div.row.center
    div.btn(:class="{ red: !clickThrough }", @click="toggleClickThrough")
      i.material-icons.left crop_3_2
      span Toggle Through
  div.divider
  div.row.center
    div.btn(@click="closeApplication")
      i.material-icons.left close
      span close
  div.divider
  div.row
    h5 Display
  div.row
    div.btn(v-for="(display, index) in displays", @click="selectDisplay(index)")
      i.material-icons.left desktop_windows
      span display {{ index }}
  div.row
    div.btn(@click="selectDisplay('here')")
      i.material-icons.left desktop_windows
      span here
</template>
<script>
const { ipcRenderer } = require('electron')
const types = require('../mutation-types')

module.exports = {
  name: 'tools',
  data () {
    return {
      settings: ipcRenderer.sendSync(types.SETTINGS_CONNECT)
    }
  },
  methods: {
    onChangeOpacityRange () {
      ipcRenderer.send('EMIT', types.CHANGE_OPACITY, this.config.opacity)
    },
    toggleClickThrough () {
      ipcRenderer.send('EMIT', types.CHANGE_THROUGTH)
      this.$data.clickThrough = this.$data.clickThrough ? false : true
    },
    closeApplication () {
      ipcRenderer.send(types.EXIT)
    },
    selectDisplay (display) {
      ipcRenderer.send('EMIT', types.SELECT_DISPLAY, display)
    }
  },
  created () {
    ipcRenderer.on('INIT_SETTINGS', (settings) => {
      this.$data.settings = settings
    })
  }
}

</script>
<style lang="stylus">

</style>
