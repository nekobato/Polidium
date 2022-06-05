import { join } from 'path';
import { BrowserWindow } from 'electron';
import { assetPath } from './env';

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
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.cjs'),
    },
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    icon: join(assetPath, `app_icon.png`),
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000/index.html#monitor');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: require('path').join(__dirname, '../renderer/index.html#monitor'),
      })
    );
  }
  return mainWindow;
}
