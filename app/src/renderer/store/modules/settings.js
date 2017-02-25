const types = require('root/mutation-types')

module.exports = {
  state: {
    displays: [1, 2, 3],
    player: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      mode: 'video-player',
      opacity: 0.05,
      clickThrough: true
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
    [types.SET_CLICKTHROUGH] (state, payload) {
      state.player.clickThrough = payload.flag
    },
    [types.RELOAD] (state) {
      window.location.reload()
    },
  }
}
