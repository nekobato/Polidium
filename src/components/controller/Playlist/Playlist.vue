<template lang="jade">
div.controller-wrapper
  play-controller
div.playlist-wrapper.white(:class="{ 'on-playing': true }")
  play-queue
div.toolpalette.blue-grey
  span.add-button.blue-grey
    i.material-icons add
</template>

<script>
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const remote      = electron.remote
const fs = remote.require('fs')
const path = remote.require('path')

import PlayQueue from './PlayQueue.vue'
import PlayController from './PlayController.vue'

export default {
  components: {
    PlayController,
    PlayQueue
  },
  data () {
    return {
      depth: [],
      filelist: [],
      reaction: {
        loadingDir: false
      }
    }
  },
  methods: {
    selectItem: function(file) {
      if (file.type === 'directory') {
        this.$emit('getDir', file)
      } else if (file.type === 'file') {
        ipcRenderer.send('controller:ipc-bridge', 'filer:select-file', JSON.stringify(file))
      }
    },
    getDir: function(file) {
      this.$data.reaction.loadingDir = true

      if (fs.statSync(file.path).isDirectory()) {
        let finder = []
        for(var p of fs.readdirSync(file.path)) {
          if (/^\..*/.test(p)) { continue }
          let stats = fs.statSync(path.join(file.path, p))
          finder.push({
            name: p,
            path: path.join(file.path, p),
            type: stats.isDirectory() ? 'directory' : 'file'
          })
        }

        this.$emit('filer-set-dir', finder)
        this.$data.reaction.loadingDir = false
      }
    },
    setDir: function(files) {
      this.$set('filelist', files)
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~stylesheets/variable'

.controller-wrapper
  position: absolute
  top: 56px
  left: 0
  padding: 0 0 6px
  width: 100%
  height: 80px
.playlist-wrapper
  position: absolute
  top: 58px
  bottom: 16px
  width: 100%
  overflow-x: hidden
  overflow-y: scroll
  border-radius: 5px
  &.on-playing
    top: 56px + 80px
.toolpalette
  position: absolute
  left: 0
  bottom: 0
  width: 100%
  height: 12px
.add-button
  position: absolute
  bottom: 12px
  left: 0
  right: 0
  border-radius: 48px 48px 0 0
  width: 64px
  height: 32px
  margin: auto
  text-align: center
  cursor: pointer
  color: #e0e0e0
  line-height: 48px
  &:hover
    color: #fafafa
  .material-icons
    margin-top: 8px

</style>
