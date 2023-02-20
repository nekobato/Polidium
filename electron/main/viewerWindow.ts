import electron, { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DEBUG } from './env';
const preload = join(__dirname, '../preload/index.js');

export const createViewerWindow = (url: string) => {
  var screen = electron.screen;
  var size = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    skipTaskbar: true,
    width: DEBUG ? 400 : size.width,
    height: DEBUG ? 300 : size.height - 24, // Macの上のトレイ分短く
    center: true,
    show: false,
    resizable: false,
    frame: false,
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
