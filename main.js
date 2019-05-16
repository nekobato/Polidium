'use strict';

const electron = require('electron');
const {
  app,
  BrowserView,
  BrowserWindow,
  Tray,
  nativeImage,
  globalShortcut,
  ipcMain
} = electron;
const widevine = require('electron-widevinecdm');
const DEBUG = !!process.env.DEBUG;
const MAC = process.platform === 'darwin';
const types = require('./mutation-types');

// if (MAC) app.dock.hide();

widevine.load(app);

// app.commandLine.appendSwitch(
//   'widevine-cdm-path',
//   './lib/WidevineCdm/_platform_specific/mac_x64/libwidevinecdm.'
// );
// // The version of plugin can be got from `chrome://plugins` page in Chrome.
// app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1303.2');

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
      plugins: true
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

  screenWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options) => {
      console.log(event, url, frameName, disposition, options);
    }
  );

  return screenWindow;
}

app.on('ready', () => {
  createWindow();

  const trayIconOn = nativeImage.createFromPath(__dirname + '/public/icon.png');
  const trayIconOff = nativeImage.createFromPath(
    __dirname + '/public/icon.png'
  );
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

  const webview = new BrowserView();
  // screenWindow.setBrowserView(webview);
  adjustWebview();
  webview.webContents.loadURL('https://google.com');

  screenWindow.on('resize', () => {
    adjustWebview();
  });

  webview.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options) => {
      console.log(event, url, frameName, disposition, options);
    }
  );

  function adjustWebview() {
    const { width, height } = screenWindow.getBounds();
    webview.setBounds({
      x: 0,
      y: 48,
      width,
      height: height - 24
    });
  }

  ipcMain.on('SET_OPACITY', (_, payload) => {
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
