<template lang="jade">
div.controller
  div.tabs-container.blue-grey
    button.btn file
    button.btn Web
    button.btn-floating
      i.material-icons settings
  component(:is="currentView")
</template>
<script>
import store from '../vuex/store'

import Playlist from './Playlist'
import Web from './Web'
import Tools from './Tools'

export default {
  el: '#controller',
  data: {
    currentView: 'Playlist'
  },
  components: {
    Playlist
  },
  store
}
</script>
<style lang="stylus" scoped>

.controller
  margin: auto
  width: 100%
  height: 100%
  border-radius: 5px

.tabs-container
  height: 36px
</style>
