<template lang="jade">
div.player
  component(:is="viewMode")
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer

import Vue from 'vue'

import VideoPlayer from './VideoPlayer.vue'
import WebPlayer from './WebPlayer.vue'

new Vue({
  el: '#player',
  components: {
    VideoPlayer,
    WebPlayer
  },
  data: {
    viewMode: 'video-player',
    clickThrough: true,
    config: config
  },
  events: {
    'filer:select-file': function(fileStr) {
      let file = JSON.parse(fileStr)
      this.viewMode = 'video-player'
      this.$nextTick(function() {
        this.$broadcast('player:receive-file', file)
      })
    },
    'url:submit-url': function(url) {
      this.viewMode = 'web-player'
      this.$nextTick(function() {
        this.$broadcast('player:receive-url', url)
      })
    },
    'settings:change-opacity': function(opacity) {
      this.config.opacity = opacity
    }
  },
  ready: function() {
    ipcRenderer.on('main:ipc-bridge', (event, channel, data) => {
      this.$emit(channel, data)
    })

    ipcRenderer.on('main:toggle-player', (event, flag) => {
      this.clickThrough = flag ? true : false
      this.$broadcast('main:toggle-player', flag)
    })
  }
})
</script>
