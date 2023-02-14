import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { useLoading } from "./loading";

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();
  appendLoading();
})();

contextBridge.exposeInMainWorld("removeLoading", removeLoading);
contextBridge.exposeInMainWorld("ipc", {
  send(event: string, payload: any) {
    ipcRenderer.send("renderer-event", event, payload);
  },
  on(
    event: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) {
    ipcRenderer.on(event, callback);
  },
});
