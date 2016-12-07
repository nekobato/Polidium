const { ipcRenderer } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')
const types = require('../mutation-types')

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

module.exports = new Vuex.Store({
  state: {
    player: ipcRenderer.sendSync(types.CONNECT_STATE),
    video: {
      src: '',
      controls: false
    },
    web: {
      src: ''
    }
  },
  mutations: {
    [types.CHANGE_LAYOUT] (state, layout) {
      state.player.x = layout.x
      state.player.y = layout.y
      state.player.width = layout.width
      state.player.height = layout.height
    },
    [types.CHANGE_MODE] (state, mode) {
      // mode = video | web
      state.player.mode = mode
    },
    [types.CHANGE_OPACITY] (state, newOpacity) {
      state.player.opacity = newOpacity
    },
    [types.PLAY_FILE] (state, filePath) {
      console.log(filePath)
      state.video.src = filePath
    },
    [types.OPEN_URL] (state, url) {
      state.web.src = url
    }
  },
  strict: DEBUG
})
