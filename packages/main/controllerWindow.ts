import electron, { BrowserWindow } from 'electron';
import { join } from 'path';

let controllerWindow: electron.BrowserWindow | null;

export function createWindow() {
  controllerWindow = new BrowserWindow({
    x: 0,
    y: 32,
    width: 240,
    height: 320, // size of Mac tray size
    show: false,
    resizable: process.env.NODE_ENV === 'development' ? true : false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      nodeIntegration: true,
    },
    frame: false,
    transparent: true,
    hasShadow: true,
    skipTaskbar: true,
    alwaysOnTop: false,
  });

  controllerWindow.setVisibleOnAllWorkspaces(true);

  if (process.env.NODE_ENV === 'development') {
    controllerWindow.loadURL('http://localhost:3000/index.html#controller');
    controllerWindow.webContents.openDevTools();
  } else {
    controllerWindow.loadURL(
      require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: require('path').join(__dirname, '../renderer/index.html#controller'),
      })
    );
  }

  controllerWindow.on('blur', () => {
    if (controllerWindow) {
      controllerWindow.hide();
    }
  });

  return controllerWindow;
}
