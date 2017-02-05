<template lang="jade">
div.my-controller(
  @dragover.prevent="onDragOver",
  @dragleave.prevent="onDragLeave",
  @dragend.prevent="onDragEnd",
  @drop.prevent="onDrop")
  div.blue-grey.my-tabs
    button.waves-effect.waves-teal.btn-flat.my-tab(
      @click="switchView('FileController')",
      :class="{ 'my-on': currentView === 'FileController' }") file
    button.waves-effect.waves-teal.btn-flat.my-tab(
      @click="switchView('WebController')",
      :class="{ 'my-on': currentView === 'WebController' }") Web
    button.waves-effect.waves-teal.btn-flat.my-tab.my-settings(
      @click="switchView('Settings')",
      :class="{ 'my-on': currentView === 'Settings' }")
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
    WebController,
    Settings
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
