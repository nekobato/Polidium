import { createStore } from 'vuex'
import * as types from 'root/mutation-types'
import * as Sentry from '@sentry/electron'
import video from './modules/video'
import web from './modules/web'
import settings from './modules/settings'

const ipc = (window as any).electronAPI

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

ipc.on(types.CONNECT_COMMIT, (typeName: string, payload: string) => {
  store.commit(typeName, JSON.parse(payload))
})

export default store
