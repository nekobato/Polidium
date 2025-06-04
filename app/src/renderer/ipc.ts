import * as types from 'root/mutation-types'

const ipc = (window as any).electronAPI

export default {
  commit (type: string, payload: unknown) {
    ipc.send(types.CONNECT_COMMIT, type, JSON.stringify(payload))
  }
}
