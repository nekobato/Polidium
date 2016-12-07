<template lang="jade">
div.white.tools.container
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
const ipcRenderer = require('electron').ipcRenderer;

export default {
  data: function() {
    return {
      clickThrough: true
    }
  },
  events: {
  },
  methods: {
    onChangeOpacityRange: function(e) {
      ipcRenderer.send('controller:ipc-bridge', 'settings:change-opacity', this.config.opacity);
    },
    toggleClickThrough: function() {
      ipcRenderer.send('controller:toggle-player');
      this.$data.clickThrough = this.$data.clickThrough ? false : true;
    },
    closeApplication: function() {
      ipcRenderer.send('controller:close-application');
    }
  }
}

</script>
<style lang="stylus">

</style>
