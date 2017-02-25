const types = require('root/mutation-types')

module.exports = {
  state: {
    src: ''
  },
  mutations: {
    [types.OPEN_URL] (state, payload) {
      state.src = payload.src
    }
  }
}
