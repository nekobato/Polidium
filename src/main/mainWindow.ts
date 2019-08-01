import path from 'path';
import { BrowserWindow } from 'electron';
import logger from './log';
import { assetPath, DEBUG } from './env';

const electron = require('electron');

export function createWindow() {
  const { workAreaSize } = electron.screen.getPrimaryDisplay();

  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: DEBUG ? 480 : workAreaSize.width,
    height: DEBUG ? 320 : workAreaSize.height - 24, // size of Mac tray size
    minWidth: 320,
    minHeight: 240,
    show: true,
    resizable: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      plugins: true,
      webSecurity: false,
    },
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: false,
    icon: path.join(assetPath, `app_icon.png`),
  });

  mainWindow.loadURL(DEBUG ? 'http://localhost:8080' : __dirname + '/../index.html');

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    logger.debug('new window', [event, url, frameName, disposition, options]);
  });

  return mainWindow;
}
