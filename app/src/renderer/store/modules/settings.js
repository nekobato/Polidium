const { ipcRenderer } = require('electron')
const types = require('root/mutation-types')

function getSettingsFromLocalStrage () {
  return settings = localStorage.settings ? JSON.parse(localStorage.settings) : {
    player: {
      mode: 'video-player',
      opacity: 0.05,
      clickThrough: true,
      resizeMode: false
    }
  }
}

const saveSettings = function () {
  localStorage.setItem('settings', JSON.stringify(state))
}

const state = getSettingsFromLocalStrage()

module.exports = {
  state: state,
  mutations: {
    [types.CHANGE_MODE] (state, mode) {
      state.player.mode = mode // mode = video | web
    },
    [types.CHANGE_OPACITY] (state, newOpacity) {
      state.player.opacity = newOpacity
      saveSettings()
    },
    [types.SET_CLICKTHROUGH] (state, payload) {
      state.player.clickThrough = payload.clickThrough
    },
    [types.RELOAD] (state) {
      window.location.reload()
    },
    [types.RESET] (state) {
      localStorage.removeItem('queues')
      localStorage.removeItem('settings')
      window.location.reload()
    },
    [types.OPEN_URL] (state, payload) {
      state.player.mode = 'web-player'
      saveSettings()
    },
    [types.VIDEO_SELECT] (state, payload) {
      state.player.mode = 'video-player'
      saveSettings()
    },
    [types.RESIZE_PLAYER] (state, payload) {
      state.player.resizeMode = payload.mode
      state.player.clickThrough = !payload.mode
    }
  }
}
