import path from 'path';
import electron, { BrowserWindow } from 'electron';
import logger from './log';
import { assetPath } from './env';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

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
      nodeIntegration: true,
      plugins: true,
      webSecurity: false,
      devTools: true,
    },
    frame: false,
    transparent: true,
    hasShadow: true,
    skipTaskbar: true,
    alwaysOnTop: false,
  });

  controllerWindow.setVisibleOnAllWorkspaces(true);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    controllerWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + '/#controller');
    // if (!process.env.IS_TEST) controllerWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    controllerWindow.loadURL('app://./index.html#controller');
  }

  controllerWindow.on('blur', () => {
    if (controllerWindow) {
      controllerWindow.hide();
    }
  });

  return controllerWindow;
}
