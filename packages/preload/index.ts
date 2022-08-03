import fs from 'fs';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { domReady } from './utils';
import { useLoading } from './loading';

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();

  appendLoading();
})();

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('ipc', {
  send(event: string, payload: any) {
    ipcRenderer.send('renderer-event', event, payload);
  },
  on(event: string, callback: (event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.on(event, callback);
  },
});
