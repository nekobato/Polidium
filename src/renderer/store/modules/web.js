import types from 'root/mutation-types'

export default {
  state: {
    src: ''
  },
  mutations: {
    [types.OPEN_URL] (state, payload) {
      state.src = payload.src
    }
  }
}
