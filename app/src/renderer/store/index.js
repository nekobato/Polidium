import { ipcRenderer } from 'electron'
import { createStore } from 'vuex'
import * as types from 'root/mutation-types'
import * as Sentry from '@sentry/electron'
import video from './modules/video'
import web from './modules/web'
import settings from './modules/settings'

const DEBUG = process.env.NODE_ENV !== 'production'

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
}

const store = createStore({
  modules: {
    video,
    web,
    settings
  },
  strict: DEBUG
})

ipcRenderer.on(types.CONNECT_COMMIT, (_event, typeName, payload) => {
  store.commit(typeName, JSON.parse(payload))
})

export default store
