import { ipcRenderer } from 'electron'
import * as types from 'root/mutation-types'

export default {
  commit (type, payload) {
    ipcRenderer.send(types.CONNECT_COMMIT, type, JSON.stringify(payload))
  }
}
