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
      webPreferences: {
        preload: join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    this.win.setVisibleOnAllWorkspaces(DEBUG ? false : true);

    this.win.on("blur", () => {
      if (!DEBUG) this.win.hide();
    });

    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
      this.win.loadURL(devUrl + "#controller");
      this.win.webContents.openDevTools({ mode: "detach" });
    } else {
      this.win.loadURL("file://" + __dirname + "/index.html#controller");
    }
  }

  showWindow(x: number) {
    this.win.setPosition(x - WINDOW_WIDTH / 2, 40);
    this.win.show();
    this.win.focus();
  }

  toggle(x: number) {
    if (this.win.isVisible()) {
      this.win.hide();
    } else {
      this.showWindow(x);
    }
  }
}
