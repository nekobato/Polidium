import electron from 'electron';
import {
  app,
  BrowserWindow,
  Tray,
  globalShortcut,
  ipcMain,
  Menu,
  systemPreferences,
} from 'electron';
import path from 'path';
import logger from './log';
import menuTemplate from './menu';
// import widevine from 'electron-widevinecdm';
import * as types from '../shared/mutation-types';
import { DEBUG, isMac, assetPath } from './env';

logger.debug('Debug Mode', { DEBUG });

// if (MAC) app.dock.hide();

// widevine.load(app);

// app.commandLine.appendSwitch(
//   'widevine-cdm-path',
//   './lib/WidevineCdm/_platform_specific/mac_x64/libwidevinecdm.'
// );
// // The version of plugin can be got from `chrome://plugins` page in Chrome.
// app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1303.2');

let screenWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  const { workAreaSize } = electron.screen.getPrimaryDisplay();

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
      webviewTag: true,
      nodeIntegration: true,
      plugins: true,
    },
    frame: false,
    transparent: true,
    skipTaskbar: true,
    alwaysOnTop: false,
    icon: path.join(assetPath, `app_icon.png`),
  });

  screenWindow.loadURL(DEBUG ? 'http://localhost:8080' : './dist/renderer/index.html');

  screenWindow.on('closed', function() {
    screenWindow = null;
  });

  screenWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    logger.debug('new window', [event, url, frameName, disposition, options]);
  });

  return screenWindow;
}

function setIcon() {
  // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
  const darkOrLight = systemPreferences.isDarkMode() ? 'dark' : 'light';
  const trayIconOn = path.join(assetPath, `tray_icon_${darkOrLight}_on.png`);
  const trayIconOff = path.join(assetPath, `tray_icon_${darkOrLight}_off.png`);
  console.log(trayIconOff);
  tray = new Tray(trayIconOff);

  tray.on('click', () => {
    if (!screenWindow || !tray) {
      return;
    }
    // Click through
    const isOn = screenWindow.isAlwaysOnTop() ? true : false;
    logger.debug('tray is clicked', { isOn: isOn });

    screenWindow.webContents.send(
      isOn ? types.WINDOW_TRANSPARENT_OFF : types.WINDOW_TRANSPARENT_ON,
    );
    screenWindow.setIgnoreMouseEvents(isOn ? false : true);
    screenWindow.setVisibleOnAllWorkspaces(isOn ? false : true);
    screenWindow.setAlwaysOnTop(isOn ? false : true);
    tray.setImage(isOn ? trayIconOff : trayIconOn);
  });
}

app.on('ready', () => {
  createWindow();

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  setIcon();

  ipcMain.on('SET_OPACITY', (_: string, payload: string) => {
    if (!screenWindow) return;
    const { value } = JSON.parse(payload);
    screenWindow.setOpacity(parseInt(value, 10) / 100);
    logger.debug('set Opacity', { value: value });
  });

  ipcMain.on('SET_HIDE_ON_TASKBAR', (_: string, value: string) => {
    if (!screenWindow) return;
    const toggle = value === 'true';
    screenWindow.setSkipTaskbar(toggle);
    menu.getMenuItemById('switch_hide_taskbar').checked = toggle;
    logger.debug('hide of taskbar', { toggle: toggle });
  });

  // ipcMain.on(types.CONNECT_COMMIT, (event: string, typeName: string, payload: any) => {
  //   if (!screenWindow) return;
  //   if (isDev) console.log(typeName, payload);
  //   screenWindow.webContents.send(types.CONNECT_COMMIT, typeName, payload);
  //   if (typeName === types.QUIT) app.quit();
  // });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (isMac) {
    app.quit();
  }
});

app.on('activate', function() {
  if (screenWindow === null) {
    createWindow();
  }
});
