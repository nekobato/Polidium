import { BrowserWindow, screen, WebContentsView } from "electron";
import { join } from "path";

const DEBUG = !!process.env.DEBUG;

export default class PlayerWindow {
  win: BrowserWindow | null;
  webView: WebContentsView | null = null;
  private currentUrl: string | null = null;

  constructor() {
    const size = screen.getPrimaryDisplay().workAreaSize;

    this.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: DEBUG ? 400 : size.width,
      height: DEBUG ? 300 : size.height - 24, // Macの上のトレイ分短く
      center: true,
      show: false,
      resizable: false,
      frame: false,
      transparent: true,
      skipTaskbar: true,
      alwaysOnTop: true,
      webPreferences: {
        preload: join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    this.win.setIgnoreMouseEvents(true);
    this.win.setVisibleOnAllWorkspaces(true);

    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
      this.win.loadURL(devUrl + "#player");
    } else {
      this.win.loadURL("file://" + __dirname + "/index.html#player");
    }

    this.win.on("closed", () => {
      this.win = null;
    });
  }

  show() {
    this.win?.show();
  }

  private updateViewBounds() {
    if (!this.win || !this.webView) return;
    const [width, height] = this.win.getContentSize();
    this.webView.setBounds({ x: 0, y: 0, width, height });
  }

  private attachView() {
    if (!this.win || !this.webView) return;
    try {
      this.win.contentView.addChildView(this.webView);
      this.updateViewBounds();
    } catch (e) {
      // WebContentsView already attached
    }
  }

  private detachView() {
    if (!this.win || !this.webView) return;
    try {
      this.win.contentView.removeChildView(this.webView);
    } catch (e) {
      // WebContentsView not attached
    }
  }

  showWebView() {
    if (!this.currentUrl) return;
    if (!this.webView) {
      this.webView = new WebContentsView({
        webPreferences: {
          preload: join(__dirname, "preload.js"),
          contextIsolation: true,
          nodeIntegration: false
        }
      });
      this.win?.on("resize", () => this.updateViewBounds());
      this.webView.webContents.loadURL(this.currentUrl);
    }
    this.attachView();
  }

  openUrl(url: string) {
    this.currentUrl = url;
    if (!this.webView) {
      this.webView = new WebContentsView({
        webPreferences: {
          preload: join(__dirname, "preload.js"),
          contextIsolation: true,
          nodeIntegration: false
        }
      });
      this.win?.on("resize", () => this.updateViewBounds());
    }
    this.attachView();
    this.webView!.webContents.loadURL(url);
  }

  hideWebView() {
    this.detachView();
  }
}
