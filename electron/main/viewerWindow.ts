import { BrowserWindow } from 'electron';
import { join } from 'node:path';
const preload = join(__dirname, '../preload/index.js');

export const createViewerWindow = (url: string) => {
  const win = new BrowserWindow({
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.setIgnoreMouseEvents(true);

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(process.env.VITE_DEV_SERVER_URL + `#${url}`);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(process.env.DIST, `index.html#${url}`));
  }

  return win;
};
