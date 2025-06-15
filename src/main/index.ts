import {
  app,
  Tray,
  nativeImage,
  globalShortcut,
  ipcMain,
  Menu,
  dialog,
  BrowserWindow
} from "electron";
import * as Sentry from "@sentry/electron";
import { autoUpdater } from "electron-updater";
import * as os from "os";
import * as types from "../mutation-types";
import PlayerWindow from "./player";
import ControllerWindow from "./controller";
import { join } from "path";
import { saveWindowBounds, loadWindowBounds } from "./windowBounds";

const DEBUG = process.env.DEBUG ? true : false;
const MAC = os.type() === "Darwin";

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

if (MAC) app.dock?.hide();

// グローバル変数としてインスタンスを保持
let player: PlayerWindow | null = null;
let controller: ControllerWindow | null = null;
let tray: Tray | null = null;
let ipcHandlers: Array<() => void> = [];

function cleanupWindows() {
  // IPCハンドラーをクリーンアップ
  ipcHandlers.forEach((removeHandler) => removeHandler());
  ipcHandlers = [];

  // ウィンドウのクリーンアップ
  if (player) {
    player = null;
  }
  if (controller) {
    controller = null;
  }

  // Trayのクリーンアップ
  if (tray) {
    tray = null;
  }
}

function createWindows() {
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
    },
    {
      role: "editMenu"
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

  // 既存のウィンドウをクリーンアップ
  cleanupWindows();

  player = new PlayerWindow();
  controller = new ControllerWindow();

  // 保存されたウィンドウ位置とサイズを復元
  const savedBounds = loadWindowBounds();
  if (savedBounds && player.win && !player.win.isDestroyed()) {
    player.win.setBounds(savedBounds);
  }

  const trayIcon = nativeImage.createFromPath(
    join(__dirname, "../img", "tray_icon.png")
  );
  tray = new Tray(trayIcon);

  tray.on("click", (_event, bounds) => {
    controller?.toggle(bounds.x);
  });

  player.show();

  // ホットリロードハンドラー
  const hotReloadHandler = (msg: any) => {
    if (msg === "electron-vite&type=hot-reload") {
      // クリーンアップしてから再作成
      cleanupWindows();
      createWindows();
    }
  };

  process.removeAllListeners("message");
  process.on("message", hotReloadHandler);

  // IPCハンドラー
  const ipcHandler = (
    _event: Electron.IpcMainEvent,
    typeName: string,
    payload: string
  ) => {
    if (DEBUG) console.log(typeName, payload);

    if (!player || !controller) return;

    player.win?.webContents.send(types.CONNECT_COMMIT, typeName, payload);
    controller.win?.webContents.send(types.CONNECT_COMMIT, typeName, payload);

    // Also send to WebContentsView if it exists
    if (player.webView?.webContents) {
      player.webView.webContents.send(types.CONNECT_COMMIT, typeName, payload);
    }

    if (typeName === types.QUIT) app.quit();

    if (typeName === types.SET_CLICKTHROUGH) {
      const parsedPayload = JSON.parse(payload);
      player.win?.setIgnoreMouseEvents(parsedPayload.clickThrough);
      player.win?.setAlwaysOnTop(parsedPayload.clickThrough);
      if (MAC)
        player.win?.setVisibleOnAllWorkspaces(parsedPayload.clickThrough);
    }

    if (typeName === types.CHANGE_OPACITY) {
      const value = JSON.parse(payload);
      player.win?.setOpacity(value);
    }

    if (typeName === types.RESIZE_PLAYER) {
      const parsedPayload = JSON.parse(payload);

      if (parsedPayload.mode) {
        player.win?.focus();
      } else {
        player.win?.blur();
      }

      player.win?.setIgnoreMouseEvents(!parsedPayload.mode);
      player.win?.setAlwaysOnTop(true);
      if (MAC) player.win?.setVisibleOnAllWorkspaces(true);
      player.win?.setResizable(parsedPayload.mode);
      player.win?.setMovable(parsedPayload.mode);
      if (MAC) player.win?.setHasShadow(parsedPayload.mode);
    }

    if (typeName === types.SAVE_WINDOW_BOUNDS) {
      if (player.win && !player.win.isDestroyed()) {
        const bounds = player.win.getBounds();
        // ウィンドウ位置とサイズを保存
        saveWindowBounds(bounds);
      }
    }

    if (typeName === types.OPEN_URL) {
      const parsed = JSON.parse(payload);
      player.openUrl(parsed.src);
    }

    if (typeName === types.CHANGE_MODE) {
      const mode = JSON.parse(payload);
      if (mode === "video-player") player.hideWebView();
      if (mode === "web-player") player.showWebView();
    }
  };

  // 既存のリスナーを削除してから新しいリスナーを追加
  ipcMain.removeAllListeners(types.CONNECT_COMMIT);
  ipcMain.on(types.CONNECT_COMMIT, ipcHandler);
}

app.whenReady().then(() => {
  createWindows();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ホットリロード前のクリーンアップ
app.on("before-quit", () => {
  cleanupWindows();
});
