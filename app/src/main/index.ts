import {
  app,
  Tray,
  nativeImage,
  globalShortcut,
  ipcMain,
  Menu,
  dialog,
  screen,
  BrowserWindow
} from "electron";
import * as Sentry from "@sentry/electron";
import { autoUpdater } from "electron-updater";
import * as os from "os";
import * as types from "root/mutation-types";
import PlayerWindow from "./player";
import ControllerWindow from "./controller";

const DEBUG = process.env.DEBUG ? true : false;
const MAC = os.type() === "Darwin";

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

if (MAC) app.dock.hide();

app.on("ready", () => {
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: "Polidium",
      submenu: [
        {
          label: "Check for Updates...",
          click() {
            autoUpdater.checkForUpdates();
          }
        },
        { type: "separator" },
        { role: "quit" }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Update ready",
        message: "Update downloaded. Restart now?"
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall();
      });
  });

  const player = new PlayerWindow();
  const controller = new ControllerWindow();

  const trayIcon = nativeImage.createFromPath(__dirname + "/img/tray_icon.png");
  const tray = new Tray(trayIcon);

  tray.on("click", (_event, bounds) => {
    controller.toggle(bounds.x);
  });

  player.show();

  process.on('message', (msg) => {
    if (msg === 'electron-vite&type=hot-reload') {
      for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.reload();
      }
    }
  });

  ipcMain.on(types.CONNECT_STATE, (event) => {
    event.returnValue = store.state;
  });

  ipcMain.on(
    types.CONNECT_COMMIT,
    (_event, typeName: string, payload: string) => {
      if (DEBUG) console.log(typeName, payload);
      player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload);
      controller.win.webContents.send(types.CONNECT_COMMIT, typeName, payload);

      if (typeName === types.QUIT) app.quit();

      if (typeName === types.SET_CLICKTHROUGH) {
        const parsedPayload = JSON.parse(payload);
        player.win.setIgnoreMouseEvents(parsedPayload.clickThrough);
        player.win.setAlwaysOnTop(parsedPayload.clickThrough);
        if (MAC)
          player.win.setVisibleOnAllWorkspaces(parsedPayload.clickThrough);
      }

      if (typeName === types.RESIZE_PLAYER) {
        const parsedPayload = JSON.parse(payload);

        if (parsedPayload.mode) {
          player.win.focus();
        } else {
          player.win.blur();
        }

        player.win.setIgnoreMouseEvents(!parsedPayload.mode);
        player.win.setAlwaysOnTop(true);
        if (MAC) player.win.setVisibleOnAllWorkspaces(true);
        player.win.setResizable(parsedPayload.mode);
        player.win.setMovable(parsedPayload.mode);
        if (MAC) player.win.setHasShadow(parsedPayload.mode);
      }
    }
  );
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
