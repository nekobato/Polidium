const { ipcRenderer } = require('electron')
const types = require('root/mutation-types')

function getSettings () {
  return window.localStorage.settings ? window.localStorage.settings : {
    displays: [],
    player: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      mode: 'video-player',
      opacity: 0.05,
      clickThrough: true
    }
  }
}

module.exports = {
  state: getSettings(),
  mutations: {
    [types.CHANGE_LAYOUT] (state, layout) {
      state.player.x = layout.x
      state.player.y = layout.y
      state.player.width = layout.width
      state.player.height = layout.height
    },
    [types.CHANGE_MODE] (state, mode) {
      state.player.mode = mode // mode = video | web
    },
    [types.CHANGE_OPACITY] (state, newOpacity) {
      state.player.opacity = newOpacity
    },
    [types.SET_CLICKTHROUGH] (state, payload) {
      state.player.clickThrough = payload.flag
    },
    [types.RELOAD] (state) {
      window.location.reload()
    },
    [types.OPEN_URL] (state, payload) {
      state.player.mode = 'web-player'
    },
    [types.VIDEO_SELECT] (state, payload) {
      state.player.mode = 'video-player'
    }
  }
}
