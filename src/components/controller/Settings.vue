<template lang="jade">
div.white.settings.container
  div.row
    h5 Opacity {{config.opacity}}
    div.input-field.center
      input#opacity_range.opacity-range.validate(type="range"
        v-model="config.opacity"
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
</template>

<script>
const ipcRenderer = require('electron').ipcRenderer

import configModel from 'models/config'

export default {
  data: function() {
    return {
      config: configModel,
      clickThrough: true
    }
  },
  events: {
  },
  methods: {
    onChangeOpacityRange: function(e) {
      ipcRenderer.send('controller:ipc-bridge', 'settings:change-opacity', this.config.opacity)
    },
    toggleClickThrough: function() {
      ipcRenderer.send('controller:toggle-player')
      this.$data.clickThrough = this.$data.clickThrough ? false : true
    },
    closeApplication: function() {
      ipcRenderer.send('controller:close-application')
    }
  }
}
</script>

<style lang="stylus">
.settings
  .row
    margin: 10px
  .input-field
    margin: auto
    width: 100%
  input[type=range].opacity-range
    margin: 0 auto
    width: 300px
    height: 1rem
    background-color: transparent
    border: none
    border-radius: 0
    outline: none
    font-size: 1rem
    box-shadow: none
    box-sizing: border-box
    transition: all .3s
    text-align: center
  .opacity-range
    position: relative
    width: 100%
    height: 1rem
    & > span
      position: absolute
      display: inline-block
    & > .min-range
      left: 13px
    & > .max-range
      right: 6px
</style>
