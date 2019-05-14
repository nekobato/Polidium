'use strict';

const electron = require('electron');
const {
  // BrowserView,
  BrowserWindow,
  app,
  Tray,
  nativeImage,
  globalShortcut,
  ipcMain
} = electron;
const DEBUG = !!process.env.DEBUG;
const MAC = process.platform === 'darwin';
const types = require('./mutation-types');

// if (MAC) app.dock.hide();

let screenWindow = null;

function createWindow() {
  const { screen } = electron;
  const { workAreaSize } = screen.getPrimaryDisplay();

  screenWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: DEBUG ? 480 : workAreaSize.width,
    height: DEBUG ? 320 : workAreaSize.height - 24, // size of Mac tray size
    minWidth: 320,
    minHeight: 240,
    show: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: DEBUG ? true : false,
      webviewTag: true
    },
    frame: false,
    transparent: true,
    // skipTaskbar: false,
    alwaysOnTop: false
  });

  screenWindow.loadURL('http://localhost:8080');

  screenWindow.on('closed', function() {
    screenWindow = null;
  });

  return screenWindow;
}

app.on('ready', () => {
  createWindow();

  const trayIconOn = nativeImage.createFromPath(__dirname + '/public/icon.png');
  const trayIconOff = nativeImage.createFromPath(__dirname + '/public/icon.png');
  const tray = new Tray(trayIconOff);

  tray.on('click', (event, bounds) => {
    if (screenWindow.isAlwaysOnTop()) {
      // set transparent OFF
      screenWindow.webContents.send(types.WINDOW_TRANSPARENT_OFF);
      screenWindow.setIgnoreMouseEvents(false);
      screenWindow.setVisibleOnAllWorkspaces(false);
      screenWindow.setAlwaysOnTop(false);
      tray.setImage(trayIconOff);
    } else {
      // set transparent ON
      screenWindow.webContents.send(types.WINDOW_TRANSPARENT_ON);
      screenWindow.setIgnoreMouseEvents(true);
      screenWindow.setVisibleOnAllWorkspaces(true);
      screenWindow.setAlwaysOnTop(true);
      tray.setImage(trayIconOn);
    }
  });

  // const view = new BrowserView();
  // screenWindow.setBrowserView(view);
  // view.setBounds({ x: 0, y: 24, width: 480, height: 320 });
  // view.setAutoResize({ width: true, height: true });
  // view.webContents.loadURL('https://electronjs.org');

  ipcMain.on("SET_OPACITY", (_, payload) => {
    const { value } = JSON.parse(payload);
    screenWindow.setOpacity(parseInt(value, 10) / 100);
  });

  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
    if (DEBUG) console.log(typeName, payload);
    screenWindow.win.webContents.send(types.CONNECT_COMMIT, typeName, payload);

    if (typeName === types.QUIT) app.quit();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (MAC) {
    app.quit();
  }
});

app.on('activate', function() {
  if (screenWindow === null) {
    createWindow();
  }
});
