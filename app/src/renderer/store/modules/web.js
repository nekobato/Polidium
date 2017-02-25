const types = require('root/mutation-types')

module.exports = {
  state: {
    href: ''
  },
  mutations: {
    [types.OPEN_URL] (state, payload) {
      state.href = payload.href
    }
  }
}
