import { BrowserWindow } from 'electron';
import { join } from 'path';

let controllerWindow: BrowserWindow | null;

export function createWindow() {
  controllerWindow = new BrowserWindow({
    x: 0,
    y: 32,
    width: 320,
    height: 400, // size of Mac tray size
    show: process.env.NODE_ENV === 'development' ? true : false,
    resizable: process.env.NODE_ENV === 'development' ? true : false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      nodeIntegration: true,
    },
    frame: false,
    transparent: true,
    hasShadow: true,
    skipTaskbar: process.env.NODE_ENV !== 'development',
    alwaysOnTop: false,
  });

  controllerWindow.setVisibleOnAllWorkspaces(true);

  if (process.env.NODE_ENV === 'development') {
    controllerWindow.loadURL('http://localhost:3000/index.html#/controller');
    controllerWindow.webContents.openDevTools();
  } else {
    controllerWindow.loadURL(
      require('url').format({
        protocol: 'app',
        slashes: true,
        pathname: require('path').join(__dirname, '../renderer/index.html#/controller'),
      })
    );
  }

  if (process.env.NODE_ENV === 'development') {
    controllerWindow.webContents.openDevTools();
  }

  controllerWindow.on('blur', () => {
    if (controllerWindow) {
      controllerWindow.hide();
    }
  });

  return controllerWindow;
}
