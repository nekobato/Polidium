<template lang="jade">
div.controller
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
<style lang="stylus">
@require "~stylesheets/variable"

body, html {
  width: 100%
  height: 100%
  background-color: transparent
}

.controller {
  display: flex
  margin: auto
  width: 100%
  height: 100%
  border-radius: 5px
}
</style>
