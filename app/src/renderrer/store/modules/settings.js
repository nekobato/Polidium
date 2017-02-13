const types = require('root/mutation-types')

module.exports = {
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
      state.video.src = filePath
    },
    [types.OPEN_URL] (state, url) {
      state.web.src = url
    }
  }
}
