import electron, { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DEBUG, MAC } from './env';
const preload = join(__dirname, '../preload/index.js');

export type Viewer = { win: BrowserWindow; setWebView: (activate: boolean) => void; resizeMode: (active: boolean) => void };

export const createViewerWindow = (url: string): Viewer => {
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

  const setWebView = (activate: boolean) => {
    if (activate) {
      const view = new electron.BrowserView();
      win.setBrowserView(view);
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      view.setAutoResize({ width: true, height: true });
      view.webContents.loadURL('https://www.youtube.com/');
    } else {
      win.setBrowserView(null);

      if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL + `#${url}`);
      } else {
        win.loadFile(join(process.env.DIST, `index.html#${url}`));
      }
    }
  };

  const resizeMode = (active: boolean) => {
    win.setIgnoreMouseEvents(!active);
    win.setResizable(active);
    win.setMovable(active);
    if (MAC) win.setVisibleOnAllWorkspaces(!active);
    if (active) {
      win.focus();
    } else {
      win.blur();
    }
    win.webContents.send('main-process-message', active);
  };

  return { win, setWebView, resizeMode };
};
