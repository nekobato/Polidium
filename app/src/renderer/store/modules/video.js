const types = require('root/mutation-types')

module.exports = {
  state: {
    queues: [],
    playPointer: 0,
    controls: false
  },
  mutations: {
    [types.DROP_FILE] (state, payload) {
      state.queues.push(payload.file)
    },
    [types.PLAY_FILE] (state, payload) {
      state.playPointer = payload.index
    }
  }
}
