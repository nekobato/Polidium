import path from 'path';
import { BrowserWindow, shell } from 'electron';
import { DEBUG } from './env';

const preload = path.join(__dirname, '../preload/index.js');

export async function createControllerWindow(url: string) {
  const win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'favicon.ico'),
    width: 400,
    height: 600,
    resizable: false,
    frame: false,
    transparent: false,
    skipTaskbar: true,
    hasShadow: true,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setVisibleOnAllWorkspaces(DEBUG ? false : true);

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(process.env.VITE_DEV_SERVER_URL + 'index.html#' + url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html#', url));
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  win.on('blur', () => {
    if (!DEBUG) win.hide();
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}
