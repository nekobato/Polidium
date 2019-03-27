'use strict';

const electron = require('electron');
const {
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
    hasShadow: false
    // skipTaskbar: false,
    // alwaysOnTop: false
  });

  // this.win.setIgnoreMouseEvents(true);
  // this.win.setVisibleOnAllWorkspaces(true);

  screenWindow.loadURL('http://localhost:8080');

  screenWindow.on('closed', function() {
    screenWindow = null;
  });
}

app.on('ready', () => {
  createWindow();

  var trayIcon = nativeImage.createFromPath(__dirname + '/img/tray_icon.png');
  var tray = new Tray(trayIcon);

  tray.on('click', (event, bounds) => {});

  // player.show();

  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
    if (DEBUG) console.log(typeName, payload);
    player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload);

    if (typeName === types.QUIT) app.quit();

    // if (typeName === types.RESIZE_PLAYER) {
    //   const parsedPayload = JSON.parse(payload);

    //   if (parsedPayload.mode) {
    //     player.win.focus();
    //   } else {
    //     player.win.blur();
    //   }

    //   player.win.setIgnoreMouseEvents(!parsedPayload.mode);
    //   player.win.setAlwaysOnTop(true);
    //   if (MAC) player.win.setVisibleOnAllWorkspaces(true);
    //   player.win.setResizable(parsedPayload.mode);
    //   player.win.setMovable(parsedPayload.mode);
    //   if (MAC) player.win.setHasShadow(parsedPayload.mode);
    // }
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
