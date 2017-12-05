<template lang="jade">
div.my-controller(
  @dragover.prevent="onDragOver",
  @dragleave.prevent="onDragLeave",
  @dragend.prevent="onDragEnd",
  @drop.prevent="onDrop")
  div.blue-grey.my-tabs
    router-link.waves-effect.waves-teal.btn-flat.my-tab(to="/controller/file") file
    router-link.waves-effect.waves-teal.btn-flat.my-tab(to="/controller/web") Web
    router-link.waves-effect.waves-teal.btn-flat.my-tab.my-settings(to="/controller/settings")
      i.material-icons settings
  router-view
</template>
<script>
const ipc = require('@/lib/ipc')
const types = require('root/mutation-types')

export default {
  methods: {
    onDragOver () {
      return false
    },
    onDragLeave () {
      return false
    },
    onDragEnd () {
      return false
    },
    onDrop (e) {
      var files = e.dataTransfer.files
      for (var file of files) {
        if (file.type === 'video/mp4') {
          ipc.commit(types.DROP_FILE, {
            file: {
              name: file.name,
              path: file.path
            }
          })
        }
      }
      return false
    }
  }
}
</script>
<style lang="stylus">
body,
html
  margin: 0
  width: 100%
  height: 100%
  overflow: hidden
</style>
<style lang="stylus" scoped>
.my-controller
  display: flex
  flex-direction: column
  margin: 0
  width: 100%
  height: 100%
  border-radius: 5px
.my-tabs
  display: flex
  flex-shrink: 0
  height: 36px
.my-tab
  color: #fff
  &.my-on
    background-color: rgba(0, 0, 0, 0.2)
.my-settings
  position: absolute
  right: 0
  top: 0
  padding: 0 1rem

</style>
