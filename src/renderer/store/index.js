import { ipcRenderer } from 'electron'
import Vue from 'vue'
import Vuex from 'vuex'
import types from 'root/mutation-types'

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG

const store = new Vuex.Store({
  modules: {
    'video': require('./modules/video').default,
    'web': require('./modules/web').default,
    'settings': require('./modules/settings').default
  },
  strict: DEBUG
})

ipcRenderer.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
  store.commit(typeName, JSON.parse(payload))
})

export default store
