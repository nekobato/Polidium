import electron from 'electron';
import {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  globalShortcut,
  ipcMain,
  Menu,
  systemPreferences,
} from 'electron';
// import widevine from 'electron-widevinecdm';
import * as types from '../shared/mutation-types';
const isDev = !!process.env.DEBUG;
const MAC = process.platform === 'darwin';

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
  const { screen } = electron;
  const { workAreaSize } = screen.getPrimaryDisplay();

  screenWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: isDev ? 480 : workAreaSize.width,
    height: isDev ? 320 : workAreaSize.height - 24, // size of Mac tray size
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
    // skipTaskbar: false,
    alwaysOnTop: false,
  });

  screenWindow.loadURL('http://localhost:8080');

  screenWindow.on('closed', function() {
    screenWindow = null;
  });

  screenWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    console.log(event, url, frameName, disposition, options);
  });

  return screenWindow;
}

function createMenu() {
  const menu = new Menu.buildFromTemplate([
    // @ts-ignore: appMenu is not defined in d.ts
    {
      label: 'Polidium',
      submenu: [
        {
          id: 'reset_opacity',
          label: 'Reset Opacity',
          click(_, browserWindow) {
            browserWindow.setOpacity(1);
            browserWindow.webContents.send(types.SET_OPACITY, 100);
          },
        },
        {
          id: 'switch_hide_taskbar',
          label: 'Hide on Taskbar',
          type: 'checkbox',
        },
        {
          type: 'separator',
        },
        {
          id: 'quit',
          label: 'Quit Polidium',
          role: 'quit',
        },
      ],
    },
    // @ts-ignore: viewMenu is not defined in d.ts
    {
      label: 'View',
      role: 'viewMenu',
    },
  ]);
  Menu.setApplicationMenu(menu);
}

function setIcon() {
  // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
  const darkOrLight = systemPreferences.isDarkMode() ? 'dark' : 'light';
  const trayIconOn = nativeImage.createFromPath(`${__dirname}/public/icon_on_${darkOrLight}.png`);
  const trayIconOff = nativeImage.createFromPath(`${__dirname}/public/icon_off_${darkOrLight}.png`);
  const tray = new Tray(trayIconOff);

  tray.on('click', () => {
    if (!screenWindow) {
      return;
    }
    // Click through
    const isOn = screenWindow.isAlwaysOnTop() ? true : false;

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
  createMenu();
  setIcon();

  // const webview = new BrowserView();
  // // screenWindow.setBrowserView(webview);
  // adjustWebview();
  // webview.webContents.loadURL('https://google.com');

  // screenWindow.on('resize', () => {
  //   adjustWebview();
  // });

  // webview.webContents.on(
  //   'new-window',
  //   (event, url, frameName, disposition, options) => {
  //     console.log(event, url, frameName, disposition, options);
  //   }
  // );

  // function adjustWebview() {
  //   const { width, height } = screenWindow.getBounds();
  //   webview.setBounds({
  //     x: 0,
  //     y: 48,
  //     width,
  //     height: height - 24
  //   });
  // }

  ipcMain.on('SET_OPACITY', (_: string, payload: string) => {
    if (!screenWindow) return;
    const { value } = JSON.parse(payload);
    screenWindow.setOpacity(parseInt(value, 10) / 100);
  });

  ipcMain.on(types.CONNECT_COMMIT, (event: string, typeName: string, payload: any) => {
    if (!screenWindow) return;
    if (isDev) console.log(typeName, payload);
    screenWindow.webContents.send(types.CONNECT_COMMIT, typeName, payload);
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
