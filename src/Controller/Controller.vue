<template lang="jade">
div.controller(
  @dragover.prevent="onDragOver",
  @dragleave.prevent="onDragLeave",
  @dragend.prevent="onDragEnd",
  @drop.prevent="onDrop")
  div.blue-grey.tabs
    button.waves-effect.waves-teal.btn-flat(@click="switchView('FileController')") file
    button.waves-effect.waves-teal.btn-flat(@click="switchView('WebController')") Web
    button.waves-effect.waves-teal.btn-flat.settings(@click="switchView('Settings')")
      i.material-icons settings
  component(:is="currentView")
</template>
<script>
const types = require('root/mutation-types')
const FileController = require('./File.vue')
const WebController = require('./Web.vue')
const Settings = require('./Tools.vue')

module.exports = {
  data () {
    return {
      currentView: 'FileController'
    }
  },
  components: {
    FileController,
    WebController
  },
  methods: {
    switchView (viewName) {
      this.currentView = viewName
    },
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
      this.$store.commit(types.DROP_FILE, e.dataTransfer.files)
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
</style>
<style lang="stylus" scoped>
.controller
  display: flex
  flex-direction: column
  margin: 0
  width: 100%
  height: 100%
  border-radius: 5px
.tabs
  display: flex
  height: 36px
  .btn-flat
    color: #fff
  .settings
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 1rem

</style>
