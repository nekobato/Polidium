import {
  app,
  BrowserView,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Rectangle,
  Size,
} from 'electron';
import path from 'path';
import * as types from '../shared/mutation-types';
import { assetPath, DEBUG, isMac } from './env';
import logger from './log';
import menuTemplate from './menu';
// import widevine from 'electron-widevinecdm';
import { setTrayIcon } from './tray-icon';

const electron = require('electron');

logger.debug('Debug Mode', { DEBUG });

// if (MAC) app.dock.hide();

// widevine.load(app);

// app.commandLine.appendSwitch(
//   'widevine-cdm-path',
//   './lib/WidevineCdm/_platform_specific/mac_x64/libwidevinecdm.'
// );
// // The version of plugin can be got from `chrome://plugins` page in Chrome.
// app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1303.2');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const { workAreaSize } = electron.screen.getPrimaryDisplay();

  mainWindow = new BrowserWindow({
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

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    logger.debug('new window', [event, url, frameName, disposition, options]);
  });

  return mainWindow;
}

app.on('ready', () => {
  mainWindow = createWindow();

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  setTrayIcon(mainWindow);

  let webView: BrowserView | null = null;

  function setUrl(url: string): void {
    if (!mainWindow || !webView) return;
    mainWindow.webContents.send(types.SET_URL, {
      url,
      canGoBack: webView.webContents.canGoBack(),
      canGoForward: webView.webContents.goForward(),
    });
  }

  function createWebView(): void {
    if (!mainWindow) return;

    webView = new BrowserView();
    mainWindow.setBrowserView(webView);
    const { width, height } = mainWindow.getBounds();
    webView.setBounds({ x: 0, y: 0, width, height: height - 48 });
    webView.webContents.loadURL('https://google.com');
    webView.webContents.on('did-navigate', (_, url) => {
      setUrl(url);
    });
    webView.webContents.on('did-navigate-in-page', (_, url) => {
      setUrl(url);
    });
  }

  mainWindow.on('will-resize', (e: Event, { width, height }: Rectangle) => {
    if (webView) {
      webView.setBounds({
        x: 0,
        y: 0,
        width,
        height: height - 48,
      } as Rectangle);
    }
  });

  ipcMain.on(types.BROWSER_VIEW_EVENT, (_: string, payload: any) => {
    if (!webView) return;
    const data = JSON.parse(payload);
    switch (data.action) {
      case types.SET_URL:
        webView.webContents.loadURL(data.url);
        break;
      case types.BROWSER_RELOAD:
        webView.webContents.reload();
        break;
      case types.BROWSER_BACK:
        if (webView.webContents.canGoBack()) {
          webView.webContents.goBack();
        }
      case types.BROWSER_FORWARD:
        if (webView.webContents.canGoForward()) {
          webView.webContents.goForward();
        }
    }
  });

  // ipcMain.on('RESIZE_PLAYER', (_: string, payload: string) => {
  //   if (!mainWindow) return;
  //   const { width, height } = JSON.parse(payload);
  //   webView.setBounds({
  //     width,
  //     height,
  //   } as Rectangle);
  // });

  ipcMain.on('SET_OPACITY', (_: string, payload: string) => {
    if (!mainWindow) return;
    const { value } = JSON.parse(payload);
    mainWindow.setOpacity(parseInt(value, 10) / 100);
    logger.debug('set Opacity', { value: value });
  });

  ipcMain.on('SET_HIDE_ON_TASKBAR', (_: string, payload: string) => {
    if (!mainWindow) return;
    const { value } = JSON.parse(payload);
    const toggle = value === 'true';
    mainWindow.setSkipTaskbar(toggle);
    menu.getMenuItemById('switch_hide_taskbar').checked = toggle;
    logger.debug('hide of taskbar', { toggle: toggle });
  });

  ipcMain.on(types.SET_MODE, (_: string, payload: string) => {
    const { value } = JSON.parse(payload);
    logger.debug(`${types.SET_MODE}`, { value });
    if (value === 'web') {
      createWebView();
    } else if (value === 'video') {
      if (webView) {
        if (mainWindow) {
          mainWindow.removeBrowserView(webView);
        }
        webView.destroy();
        webView = null;
      }
    }
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
  if (mainWindow === null) {
    createWindow();
  }
});
