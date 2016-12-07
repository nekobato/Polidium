import Vue from 'vue'
import Vuex from 'vuex'
import * as types from '../mutation-types'

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

export default new Vuex.Store({
  states: {
    player: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      mode: 'video',
      opacity: 0.05,
      through: true
    },
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
    [types.PLAY_QUEUE] (state, filePath) {
      state.video.src = filePath
    },
    [types.OPEN_URL] (state, url) {
      state.web.src = url
    }
  },
  strict: DEBUG
})
