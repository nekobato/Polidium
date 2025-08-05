import { BrowserWindow } from "electron";
import { join } from "path";

const DEBUG = !!process.env.DEBUG;

const WINDOW_WIDTH = 320;

export default class ControllerWindow {
  win: BrowserWindow;

  constructor() {
    this.win = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: 310,
      show: DEBUG ? true : false,
      resizable: false,
      frame: false,
      transparent: false,
      skipTaskbar: true,
      hasShadow: true,
      minimizable: false,
      titleBarStyle: "hidden",
      titleBarOverlay: true,
      trafficLightPosition: { x: 8, y: 12 },
      webPreferences: {
        preload: join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    this.win.setVisibleOnAllWorkspaces(DEBUG ? false : true);

    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
      this.win.loadURL(devUrl + "#/controller");
      this.win.webContents.openDevTools({ mode: "detach" });
    } else {
      this.win.loadURL("file://" + __dirname + "/index.html#/controller");
    }
  }

  showWindow(x: number) {
    this.win.setPosition(x - WINDOW_WIDTH / 2, 40);
    this.win.show();
    this.win.focus();
  }

  toggle(x: number) {
    if (!this.win.isVisible()) {
      // ウィンドウが非表示の場合：表示してフォーカス
      this.showWindow(x);
    } else if (!this.win.isFocused()) {
      // ウィンドウが表示されているがフォーカスされていない場合：フォーカスのみ
      this.win.focus();
    } else {
      // ウィンドウが表示されてフォーカスされている場合：非表示
      this.win.hide();
    }
  }

  destroy() {
    if (this.win && !this.win.isDestroyed()) {
      this.win.removeAllListeners();
      this.win.close();
    }
  }
}
