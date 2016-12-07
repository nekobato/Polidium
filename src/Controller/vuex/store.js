import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'

import playlist from './modules/playlist'

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

export default new Vuex.Store({
  modules: {
    playlist,
  },
  getters,
  strict: DEBUG
})
