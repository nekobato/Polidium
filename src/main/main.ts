import {
  app,
  BrowserView,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Rectangle,
} from 'electron';
import { createWindow } from './mainWindow';
import { createWebView } from './webView';
import * as types from '../shared/mutation-types';
import { DEBUG, isMac } from './env';
import logger from './log';
import menuTemplate from './menu';
// import widevine from 'electron-widevinecdm';
import { setTrayIcon } from './tray-icon';

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

let webViewBounds: Rectangle = {
  x: 0,
  y: 0,
  width: 480,
  height: 320,
};

app.on('ready', () => {
  mainWindow = createWindow();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  setTrayIcon(mainWindow);

  let webView: BrowserView | null = null;

  mainWindow.on('will-resize', (e: Event, { width, height }: Rectangle) => {
    webViewBounds.width = width;
    webViewBounds.height = height - 48;
    if (webView) {
      webView.setBounds(webViewBounds);
    }
  });

  mainWindow.webContents.on('devtools-opened', () => {
    if (webView) {
      webView.setBounds({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      } as Rectangle);
    }
  });

  mainWindow.webContents.on('devtools-closed', () => {
    if (webView) {
      webView.setBounds(webViewBounds);
    }
  });

  ipcMain.on(types.BROWSER_VIEW_EVENT, (_, payload) => {
    if (!webView) return;
    logger.debug(types.BROWSER_VIEW_EVENT, payload);
    const contents = webView.webContents;
    const data = JSON.parse(payload);
    switch (data.action) {
      case types.SET_URL:
        contents.loadURL(data.url);
        break;
      case types.BROWSER_RELOAD:
        contents.reload();
        break;
      case types.BROWSER_BACK:
        if (contents.canGoBack()) {
          contents.goBack();
        }
      case types.BROWSER_FORWARD:
        if (contents.canGoForward()) {
          contents.goForward();
        }
    }
  });

  // ipcMain.on('RESIZE_PLAYER', (_, payload) => {
  //   if (!mainWindow) return;
  //   const { width, height } = JSON.parse(payload);
  //   webView.setBounds({
  //     width,
  //     height,
  //   } as Rectangle);
  // });

  ipcMain.on('SET_OPACITY', (_, payload) => {
    if (!mainWindow) return;
    const { value } = JSON.parse(payload);
    mainWindow.setOpacity(parseInt(value, 10) / 100);
    logger.debug('set Opacity', { value: value });
  });

  ipcMain.on('SET_HIDE_ON_TASKBAR', (_, payload) => {
    if (!mainWindow) return;
    const { value } = JSON.parse(payload);
    const toggle = value === 'true';
    mainWindow.setSkipTaskbar(toggle);
    // menu.getMenuItemById('switch_hide_taskbar').checked = toggle;
    logger.debug('hide of taskbar', { toggle: toggle });
  });

  ipcMain.on(types.SET_MODE, (_, payload) => {
    if (!mainWindow) {
      return;
    }

    const { value } = JSON.parse(payload);
    logger.debug(`${types.SET_MODE}`, { value });
    if (value === 'web') {
      webView = createWebView(mainWindow);
    } else if (value === 'video') {
      if (!webView) {
        return;
      }
      mainWindow.removeBrowserView(webView);
      webView.destroy();
      webView = null;
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
