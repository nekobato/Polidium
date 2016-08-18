import Vuex from 'vuex'
import Vue from 'vue'

import State from './state'
import Mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  State,
  Mutations
})
