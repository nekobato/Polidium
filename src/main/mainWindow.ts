import path from 'path';
import { BrowserWindow } from 'electron';
import logger from './log';
import { assetPath } from './env';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

const electron = require('electron');

export function createWindow() {
  const { workAreaSize } = electron.screen.getPrimaryDisplay();

  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: process.env.NODE_ENV === 'development' ? 480 : workAreaSize.width,
    height: process.env.NODE_ENV === 'development' ? 320 : workAreaSize.height - 24, // size of Mac tray size
    minWidth: 320,
    minHeight: 240,
    show: true,
    resizable: true,
    center: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      plugins: true,
      webSecurity: false,
      devTools: process.env.NODE_ENV === 'development' ? true : false,
    },
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: false,
    icon: path.join(assetPath, `app_icon.png`),
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mainWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + '#monitor');
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html#monitor');
  }

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    logger.debug('new window', [event, url, frameName, disposition, options]);
  });

  return mainWindow;
}
