import electron, { BrowserView } from 'electron';
import { app, BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron';
import path from 'path';
import logger from './log';
import menuTemplate from './menu';
// import widevine from 'electron-widevinecdm';
import { setTrayIcon } from './tray-icon';
import { DEBUG, isMac, assetPath } from './env';
import * as types from '../shared/mutation-types';

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
      webSecurity: false,
    },
    frame: false,
    transparent: true,
    hasShadow: false,
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

app.on('ready', () => {
  const mainWindow = createWindow();

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  setTrayIcon(mainWindow);

  let webView: BrowserView;

  function createWebView(): void {
    webView = new BrowserView();
    mainWindow.setBrowserView(webView);
    webView.setBounds({ x: 0, y: 0, width: 320, height: 240 });
    webView.webContents.loadURL('https://google.com');
  }

  ipcMain.on('BROWSER_VIEW_EVENT', (_: string, payload: any) => {
    switch (payload.action) {
      case types.OPEN_URL:
        webView.webContents.loadURL(payload.url);
        break;
      case types.RELOAD:
        webView.webContents.reload();
        break;
      case types.RESIZE_PLAYER:
        webView.setBounds({
          width: payload.width,
          height: payload.height,
        } as electron.Rectangle);
        break;
      case types.SET_MODE:
        if (payload.toggle) {
          webView.destroy();
        } else {
          createWebView();
        }
        break;
    }
  });

  ipcMain.on('SET_OPACITY', (_: string, payload: string) => {
    if (!mainWindow) return;
    const { value } = JSON.parse(payload);
    mainWindow.setOpacity(parseInt(value, 10) / 100);
    logger.debug('set Opacity', { value: value });
  });

  ipcMain.on('SET_HIDE_ON_TASKBAR', (_: string, value: string) => {
    if (!mainWindow) return;
    const toggle = value === 'true';
    mainWindow.setSkipTaskbar(toggle);
    menu.getMenuItemById('switch_hide_taskbar').checked = toggle;
    logger.debug('hide of taskbar', { toggle: toggle });
  });
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
