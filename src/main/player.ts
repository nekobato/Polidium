import { BrowserWindow, screen, WebContentsView } from "electron";
import { join } from "path";

const DEBUG = !!process.env.DEBUG;

export default class PlayerWindow {
  win: BrowserWindow | null;
  webView: WebContentsView | null = null;
  private currentUrl: string | null = null;
  private currentMode: string = "video-player"; // 現在のプレイヤーモードを保持
  private isResizeMode: boolean = false; // resize modeの状態を保持
  private ignoreMouseEvents: boolean = true; // マウスイベント無視状態を保持

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
      roundedCorners: false,
      webPreferences: {
        preload: join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    this.win.setIgnoreMouseEvents(true);
    this.win.setVisibleOnAllWorkspaces(true);

    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
      this.win.loadURL(devUrl + "#/player");
      this.win.webContents.openDevTools({ mode: "detach" });
    } else {
      this.win.loadURL("file://" + __dirname + "/index.html#/player");
    }

    this.win.on("closed", () => {
      this.win = null;
    });
  }

  show() {
    this.win?.show();
  }

  destroy() {
    // WebContentsViewのクリーンアップ
    if (this.webView) {
      this.detachView();
      // WebContentsViewの破棄
      if (!this.webView.webContents.isDestroyed()) {
        this.webView.webContents.close();
      }
      this.webView = null;
    }

    // BrowserWindowのクリーンアップ
    if (this.win && !this.win.isDestroyed()) {
      this.win.removeAllListeners();
      this.win.close();
      this.win = null;
    }
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
          nodeIntegration: false,
        },
      });
      // resizeイベントリスナーを一度だけ登録
      this.win?.removeAllListeners("resize");
      this.win?.on("resize", () => this.updateViewBounds());

      // did-finish-loadイベントでpointer-eventsを設定
      this.webView.webContents.once("did-finish-load", () => {
        this.updateWebViewPointerEvents();
      });

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
          nodeIntegration: false,
        },
      });
      // resizeイベントリスナーを一度だけ登録
      this.win?.removeAllListeners("resize");
      this.win?.on("resize", () => this.updateViewBounds());

      // did-finish-loadイベントでpointer-eventsを設定
      this.webView.webContents.once("did-finish-load", () => {
        this.updateWebViewPointerEvents();
      });
    }
    this.attachView();
    this.webView!.webContents.loadURL(url);
  }

  hideWebView() {
    this.detachView();
  }

  setMode(mode: string) {
    this.currentMode = mode;
    this.updateWebViewVisibility();
  }

  setResizeMode(isResizeMode: boolean) {
    this.isResizeMode = isResizeMode;
    this.updateWebViewVisibility();
    // リサイズモード変更時もpointer-eventsを更新
    if (this.currentMode === "web-player") {
      this.updateWebViewPointerEvents();
    }
  }

  private updateWebViewVisibility() {
    // resize modeがONで、かつweb-player modeの場合、webviewを非表示にする
    if (this.isResizeMode && this.currentMode === "web-player") {
      this.detachView();
    } else if (this.currentMode === "web-player" && this.currentUrl) {
      // resize modeがOFFで、web-player modeの場合、webviewを表示する
      this.showWebView();
    }
  }

  public updateWebViewPointerEvents() {
    if (!this.webView || this.webView.webContents.isDestroyed()) return;

    const css = this.ignoreMouseEvents ? `* { pointer-events: none !important; }` : ``;

    this.webView.webContents.insertCSS(css);
  }

  setIgnoreMouseEvents(ignore: boolean) {
    this.ignoreMouseEvents = ignore;
    this.win?.setIgnoreMouseEvents(ignore);
    this.updateWebViewPointerEvents();
  }
}
