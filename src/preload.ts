import { contextBridge, ipcRenderer, clipboard, webUtils } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  send(channel: string, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args);
  },
  on(channel: string, listener: (...args: unknown[]) => void) {
    ipcRenderer.on(channel, (_event, ...rest) => listener(...rest));
  },
  async invoke(channel: string, ...args: unknown[]) {
    return await ipcRenderer.invoke(channel, ...args);
  },
  readClipboardText() {
    return clipboard.readText();
  },
  getFilePath(file: File) {
    // Convert file path to a URL format
    return webUtils.getPathForFile(file);
  },
});
