import electron, {
  app,
  BrowserView,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Rectangle,
  protocol,
  Tray,
  webContents,
} from 'electron';
import { createWindow as createMainWindow } from './mainWindow';
import { createWindow as createControllerWindow } from './controllerWindow';
import { createWebView } from './webView';
import * as types from '../mutation-types';
import { DEBUG, isMac } from './env';
import { release } from 'os';
import menuTemplate from './menu';
// import widevine from 'electron-widevinecdm';
import { setTrayIcon } from './tray-icon';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// if (MAC) app.dock.hide();

// widevine.load(app);

// app.commandLine.appendSwitch(
//   'widevine-cdm-path',
//   './lib/WidevineCdm/_platform_specific/mac_x64/libwidevinecdm.'
// );
// // The version of plugin can be got from `chrome://plugins` page in Chrome.
// app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1303.2');

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let controllerWindow: BrowserWindow | null = null;

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

let webViewBounds: Rectangle = {
  x: 0,
  y: 0,
  width: 480,
  height: 320,
};

app.on('ready', async () => {
  const reflectBrowserHistriesPosition = () => {
    if (!webView || !controllerWindow) return;
    const contents = webView.webContents;
    controllerWindow.webContents.send(types.BROWSER_CAN_GO_BACK, { status: contents.canGoBack() });
    controllerWindow.webContents.send(types.BROWSER_CAN_GO_FORWARD, {
      status: contents.canGoForward(),
    });
  };

  tray = setTrayIcon();

  tray.on('click', (_, bounds) => {
    if (controllerWindow) {
      if (!controllerWindow.isVisible()) {
        controllerWindow.setPosition(bounds.x - 109, 32, true);
        controllerWindow.show();
      } else {
        controllerWindow.hide();
      }
    }
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow = createMainWindow();
  controllerWindow = createControllerWindow();

  let webView: BrowserView | null = null;

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('will-resize', (e: Event, { width, height }: Rectangle) => {
    webViewBounds.width = width;
    webViewBounds.height = height;
    if (webView) {
      webView.setBounds(webViewBounds);
    }
  });

  ipcMain.on('renderer-event', (_, event: string, payload: any) => {
    switch (event) {
      case types.BROWSER_VIEW_EVENT:
        if (!webView || !controllerWindow) return;
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
              reflectBrowserHistriesPosition();
            }
            break;
          case types.BROWSER_FORWARD:
            if (contents.canGoForward()) {
              contents.goForward();
              reflectBrowserHistriesPosition();
            }
            break;
        }
        break;
      case types.VIDEO_VIEW_EVENT:
        mainWindow?.webContents.send(payload.action, payload.payload);
        break;
      case types.TOGGLE_RESIZE:
        mainWindow?.webContents.send(event);
        break;
      case types.SET_OPACITY:
        if (!mainWindow) return;
        mainWindow.setOpacity(Number(payload.value) / 100);
        break;
      case types.SET_FULLSCREEN:
        const { workAreaSize } = electron.screen.getPrimaryDisplay();
        mainWindow?.setBounds({ width: workAreaSize.width, height: workAreaSize.height - 24 });
        break;

      case types.SET_HIDE_ON_TASKBAR:
        if (!mainWindow) return;
        const toggle = payload.value === 'true';
        mainWindow.setSkipTaskbar(toggle);
        break;
      case types.OPEN_WEBVIEW:
        if (!mainWindow) return;
        const { width, height } = mainWindow.getBounds();
        webView?.setBounds({ x: 0, y: 0, width, height });
        break;
      case types.CLOSE_WEBVIEW:
        if (!mainWindow) return;
        webView?.setBounds({ x: 0, y: 0, width: 0, height: 0 });
        break;
      case types.SET_MODE:
        if (!mainWindow || !controllerWindow) {
          return;
        }

        const { value } = payload;

        if (value === 'web') {
          webView = createWebView(mainWindow, controllerWindow);
        } else if (value === 'video') {
          if (!webView) {
            return;
          }
          mainWindow.removeBrowserView(webView);
          webView = null;
          if (process.env.NODE_ENV === 'development') {
            mainWindow.loadURL('http://localhost:3000/index.html#/monitor/video');
            mainWindow.webContents.openDevTools();
          } else {
            mainWindow.loadURL(
              require('url').format({
                protocol: 'app',
                slashes: true,
                pathname: require('path').join(__dirname, '../renderer/index.html#/monitor/video'),
              })
            );
          }
        }
        break;
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

app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow();
  }
});

if (DEBUG) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
