import { BrowserWindow, screen, WebContentsView, shell } from "electron";
import { join } from "path";

const DEBUG = !!process.env.DEBUG;

export default class PlayerWindow {
  win: BrowserWindow | null;
  webView: WebContentsView | null = null;
  private currentUrl: string | null = null;
  private currentMode: string = "video-player"; // 現在のプレイヤーモードを保持
  private isResizeMode: boolean = false; // resize modeの状態を保持
  private ignoreMouseEvents: boolean = true; // マウスイベント無視状態を保持
  private navigationEventHandlers: Array<() => void> = []; // イベントハンドラー管理
  private onNavigationStateChange?: (state: any) => void; // ナビゲーション状態変更のコールバック
  private onNavigationHistoryChange?: (history: any) => void; // ナビゲーション履歴変更のコールバック
  private insertedCSSKey: string = ""; // 挿入されたCSSのキーを保持

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
      this.win.loadURL("file://" + __dirname + "/../dist/index.html#/player");
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
      this.cleanupNavigationEvents();
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

    // 既存のWebContentsViewがある場合は再利用
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
        console.log("[Player] WebContentsView did-finish-load (showWebView), applying pointer-events");
        this.updateWebViewPointerEvents();
      });

      // ナビゲーションイベントを設定
      this.setupWebViewNavigationEvents();

      // target="_blank"のリンクをデフォルトブラウザで開く
      this.webView.webContents.setWindowOpenHandler(({ url }) => {
        // HTTPとHTTPSのみ許可（セキュリティ対策）
        if (url.startsWith("http:") || url.startsWith("https:")) {
          shell.openExternal(url);
        }
        return { action: "deny" }; // 新しいElectronウィンドウの作成を拒否
      });

      this.webView.webContents.loadURL(this.currentUrl);
    }

    // WebContentsViewをアタッチ（状態は保持される）
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
        console.log("[Player] WebContentsView did-finish-load (openUrl), applying pointer-events");
        this.updateWebViewPointerEvents();
      });

      // ナビゲーションイベントを設定
      this.setupWebViewNavigationEvents();

      // target="_blank"のリンクをデフォルトブラウザで開く
      this.webView.webContents.setWindowOpenHandler(({ url }) => {
        // HTTPとHTTPSのみ許可（セキュリティ対策）
        if (url.startsWith("http:") || url.startsWith("https:")) {
          shell.openExternal(url);
        }
        return { action: "deny" }; // 新しいElectronウィンドウの作成を拒否
      });
    }
    this.attachView();
    this.webView!.webContents.loadURL(url);
  }

  hideWebView() {
    this.detachView();
  }

  destroyWebView() {
    if (this.webView) {
      // ナビゲーションイベントをクリーンアップ
      this.cleanupNavigationEvents();

      // WebContentsViewをデタッチ
      this.detachView();

      // WebContentsを破棄してメディア再生を停止
      if (!this.webView.webContents.isDestroyed()) {
        this.webView.webContents.close();
      }

      // WebContentsViewを削除
      this.webView = null;

      console.log("[Player] WebContentsView destroyed");
    }
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
    if (this.currentMode === "video-player") {
      // video-playerモード時：WebContentsViewを非表示（状態は保持）
      this.detachView();
    } else if (this.currentMode === "web-player" && this.currentUrl) {
      // web-playerモード時：WebContentsViewを表示
      // resize modeがONの場合は非表示のまま
      if (this.isResizeMode) {
        this.detachView();
      } else {
        this.showWebView();
      }
    }
  }

  public async updateWebViewPointerEvents() {
    if (!this.webView || this.webView.webContents.isDestroyed()) return;

    const css = `body, html { pointer-events: none !important; } button, a, input, select, textarea, [onclick], [data-click] { pointer-events: none !important; }`;

    if (this.ignoreMouseEvents) {
      this.insertedCSSKey = await this.webView.webContents.insertCSS(css);
    } else {
      if (!this.insertedCSSKey) return;
      this.webView.webContents.removeInsertedCSS(this.insertedCSSKey);
    }
  }

  setIgnoreMouseEvents(ignore: boolean) {
    this.ignoreMouseEvents = ignore;
    this.win?.setIgnoreMouseEvents(ignore);
    this.updateWebViewPointerEvents();
  }

  private setupWebViewNavigationEvents() {
    if (!this.webView || this.webView.webContents.isDestroyed()) return;

    const webContents = this.webView.webContents;

    // ナビゲーション状態の更新を通知する関数
    const notifyNavigationState = () => {
      if (webContents.isDestroyed()) return;

      const navigationState = {
        canGoBack: webContents.navigationHistory.canGoBack(),
        canGoForward: webContents.navigationHistory.canGoForward(),
        isLoading: webContents.isLoading(),
        url: webContents.getURL(),
      };

      // ナビゲーション状態変更のコールバックを呼び出し
      if (this.onNavigationStateChange) {
        this.onNavigationStateChange(navigationState);
      }
    };

    // ナビゲーション履歴の更新を通知する関数
    const notifyNavigationHistory = () => {
      if (webContents.isDestroyed()) return;

      try {
        // WebContentsのnavigationHistoryを取得（型アサーションで対応）
        const history = webContents.navigationHistory as any;
        const navigationHistory = {
          currentIndex: history.currentIndex || 0,
          entries: (history.entries || []).map((entry: any) => ({
            url: entry.url || "",
            title: entry.title || entry.url || "",
          })),
        };

        // ナビゲーション履歴変更のコールバックを呼び出し
        if (this.onNavigationHistoryChange) {
          this.onNavigationHistoryChange(navigationHistory);
        }
      } catch (error) {
        console.error("Failed to get navigation history:", error);
      }
    };

    // ナビゲーション状態と履歴の両方を更新する関数
    const notifyAll = () => {
      notifyNavigationState();
      notifyNavigationHistory();
    };

    // イベントリスナーを設定
    const handlers = [
      () => webContents.on("did-finish-load", notifyAll),
      () => webContents.on("did-fail-load", notifyAll),
      () => webContents.on("did-start-loading", notifyNavigationState),
      () => webContents.on("did-stop-loading", notifyNavigationState),
      () => webContents.on("did-navigate", notifyAll),
      () => webContents.on("did-navigate-in-page", notifyAll),
    ];

    // ハンドラーを実行してイベントリスナーを登録
    handlers.forEach((handler) => handler());

    // クリーンアップ用にハンドラーを保存
    this.navigationEventHandlers = [
      () => webContents.removeAllListeners("did-finish-load"),
      () => webContents.removeAllListeners("did-fail-load"),
      () => webContents.removeAllListeners("did-start-loading"),
      () => webContents.removeAllListeners("did-stop-loading"),
      () => webContents.removeAllListeners("did-navigate"),
      () => webContents.removeAllListeners("did-navigate-in-page"),
    ];

    // 初期状態を通知
    notifyAll();
  }

  private cleanupNavigationEvents() {
    this.navigationEventHandlers.forEach((cleanup) => cleanup());
    this.navigationEventHandlers = [];
  }

  goBack() {
    if (this.webView && !this.webView.webContents.isDestroyed()) {
      this.webView.webContents.goBack();
    }
  }

  goForward() {
    if (this.webView && !this.webView.webContents.isDestroyed()) {
      this.webView.webContents.goForward();
    }
  }

  reloadWebView() {
    if (this.webView && !this.webView.webContents.isDestroyed()) {
      this.webView.webContents.reload();
    }
  }

  setNavigationStateChangeCallback(callback: (state: any) => void) {
    this.onNavigationStateChange = callback;
  }

  setNavigationHistoryChangeCallback(callback: (history: any) => void) {
    this.onNavigationHistoryChange = callback;
  }

  goToIndex(index: number) {
    if (this.webView && !this.webView.webContents.isDestroyed()) {
      this.webView.webContents.goToIndex(index);
    }
  }
}
