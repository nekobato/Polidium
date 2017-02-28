const { ipcRenderer } = require('electron')
const types = require('root/mutation-types')

const state = window.localStorage.settings ? JSON.parse(window.localStorage.settings) : {
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

const saveSettings = function () {
  localStorage.setItem('settings', JSON.stringify(state))
}

module.exports = {
  state: state,
  mutations: {
    [types.CHANGE_LAYOUT] (state, layout) {
      state.player.x = layout.x
      state.player.y = layout.y
      state.player.width = layout.width
      state.player.height = layout.height
      saveSettings()
    },
    [types.CHANGE_MODE] (state, mode) {
      state.player.mode = mode // mode = video | web
    },
    [types.CHANGE_OPACITY] (state, newOpacity) {
      state.player.opacity = newOpacity
      saveSettings()
    },
    [types.SET_CLICKTHROUGH] (state, payload) {
      state.player.clickThrough = payload.flag
      saveSettings()
    },
    [types.RELOAD] (state) {
      window.location.reload()
    },
    [types.OPEN_URL] (state, payload) {
      state.player.mode = 'web-player'
      saveSettings()
    },
    [types.VIDEO_SELECT] (state, payload) {
      state.player.mode = 'video-player'
      saveSettings()
    }
  }
}
