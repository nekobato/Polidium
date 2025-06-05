import { contextBridge, ipcRenderer, clipboard } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  send(channel: string, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args)
  },
  on(channel: string, listener: (...args: unknown[]) => void) {
    ipcRenderer.on(channel, (_event, ...rest) => listener(...rest))
  },
  invoke(channel: string, ...args: unknown[]) {
    return ipcRenderer.invoke(channel, ...args)
  },
  readClipboardText() {
    return clipboard.readText()
  }
})
