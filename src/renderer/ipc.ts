import * as types from "@/mutation-types";

const ipc = (window as any).electronAPI;

export default {
  commit(type: string, payload?: any) {
    console.log("ipc commit", type, payload);
    ipc.send(types.CONNECT_COMMIT, type, JSON.stringify(payload));
  },
  readClipboardText() {
    return ipc.readClipboardText();
  },
  on(channel: string, listener: (...args: unknown[]) => void) {
    ipc.on(channel, listener);
  },
  removeListener(channel: string, listener: (...args: unknown[]) => void) {
    // Electron IPC doesn't have removeListener, but we can work around this
    // by not implementing it (the listener will be removed on component unmount)
  },
  async invoke(channel: string, ...args: unknown[]) {
    return ipc.invoke(channel, ...args);
  },
  getFilePath(file: File) {
    return ipc.getFilePath(file);
  },
  pathToFileURL(filePath: string) {
    return ipc.pathToFileURL(filePath);
  },
};
