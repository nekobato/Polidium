import { app, Tray, nativeImage, ipcMain, Menu, dialog, BrowserWindow, net, protocol, globalShortcut, session } from "electron";
import * as Sentry from "@sentry/electron";
import { autoUpdater } from "electron-updater";
import * as os from "os";
import * as types from "../src/mutation-types";
import PlayerWindow from "./player";
import ControllerWindow from "./controller";
import * as fs from "fs";
import * as path from "path";
import { saveWindowBounds, loadWindowBounds } from "./windowBounds";
import { pathToFileURL } from "url";
import { randomUUID } from "crypto";

const DEBUG = process.env.DEBUG ? true : false;
const MAC = os.type() === "Darwin";
const APP_PROTOCOL = "polidium";
const APP_PROTOCOL_HOST = "app";
const MEDIA_PROTOCOL = "media";
const MAX_FOLDER_VIDEO_FILES = 500;
const VIDEO_FILE_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v", ".3gp", ".flv", ".wmv"]);

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

if (MAC) app.dock?.hide();

// グローバル変数としてインスタンスを保持
let player: PlayerWindow | null = null;
let controller: ControllerWindow | null = null;
let tray: Tray | null = null;
let ipcHandlers: Array<() => void> = [];
let currentGlobalShortcut: string | null = null;
let savedOpacity: number = 0.05;
let isPlayerHidden: boolean = false;
let protocolHandlersRegistered: boolean = false;
const mediaFileTokens = new Map<string, string>();

// media://xxxx
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
  {
    scheme: MEDIA_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

/**
 * Returns the production app entry URL for trusted renderer checks.
 */
function getProductionAppEntryFileUrl(): string {
  return pathToFileURL(path.join(__dirname, "../dist/index.html")).href;
}

/**
 * Checks whether a renderer URL belongs to this packaged app.
 */
function isTrustedAppUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const devUrl = process.env.VITE_DEV_SERVER_URL;

    if (devUrl && parsedUrl.origin === new URL(devUrl).origin) return true;
    if (parsedUrl.protocol === `${APP_PROTOCOL}:` && parsedUrl.hostname === APP_PROTOCOL_HOST) return true;

    return url.startsWith(getProductionAppEntryFileUrl());
  } catch {
    return false;
  }
}

/**
 * Checks whether an IPC event came from one of the trusted app windows.
 */
function isTrustedAppIpcEvent(event: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent): boolean {
  if (!event.senderFrame) return false;
  if (event.senderFrame !== event.sender.mainFrame) return false;

  const fromPlayerWindow = event.sender === player?.win?.webContents;
  const fromControllerWindow = event.sender === controller?.win?.webContents;

  return (fromPlayerWindow || fromControllerWindow) && isTrustedAppUrl(event.senderFrame.url);
}

/**
 * Resolves a requested app protocol URL to a file inside dist.
 */
function resolveAppProtocolPath(requestUrl: string): string | null {
  const parsedUrl = new URL(requestUrl);
  if (parsedUrl.hostname !== APP_PROTOCOL_HOST) return null;

  const distRoot = path.resolve(__dirname, "../dist");
  const rawPathname = decodeURIComponent(parsedUrl.pathname || "/index.html");
  const pathname = rawPathname === "/" ? "/index.html" : rawPathname;
  const filePath = path.resolve(distRoot, `.${pathname}`);

  if (filePath !== distRoot && !filePath.startsWith(`${distRoot}${path.sep}`)) {
    return null;
  }

  return filePath;
}

/**
 * Serves packaged renderer assets from the app custom protocol.
 */
async function handleAppProtocolRequest(req: Request): Promise<Response> {
  const filePath = resolveAppProtocolPath(req.url);
  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    return await net.fetch(pathToFileURL(filePath).href);
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

/**
 * Creates an opaque media URL for an explicitly selected local file.
 */
function createMediaUrlForFile(filePath: string, fileName: string): string {
  if (!path.isAbsolute(filePath)) {
    throw new Error("Media file path must be absolute");
  }

  mediaFileTokens.clear();
  const token = randomUUID();
  mediaFileTokens.set(token, filePath);

  const safeName = encodeURIComponent(fileName || path.basename(filePath));
  return `${MEDIA_PROTOCOL}://${token}/${safeName}`;
}

/**
 * Serves only token-approved media files.
 */
async function handleMediaProtocolRequest(req: Request): Promise<Response> {
  const parsedUrl = new URL(req.url);
  const filePath = mediaFileTokens.get(parsedUrl.hostname);

  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    return await net.fetch(pathToFileURL(filePath).href, { headers: req.headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

/**
 * Registers custom protocol handlers once per app lifetime.
 */
function registerProtocolHandlers(): void {
  if (protocolHandlersRegistered) return;

  protocol.handle(APP_PROTOCOL, handleAppProtocolRequest);
  protocol.handle(MEDIA_PROTOCOL, handleMediaProtocolRequest);
  protocolHandlersRegistered = true;
}

/**
 * Denies browser permission prompts from remote content by default.
 */
function configureSessionSecurity(): void {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
}

/**
 * Returns whether a path looks like a supported video file.
 */
function isSupportedVideoFilePath(filePath: string): boolean {
  return VIDEO_FILE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

/**
 * Recursively lists supported videos under a folder with a fixed result cap.
 */
async function listVideoFilesInFolder(folderPath: string, recursive: boolean): Promise<Array<{ name: string; path: string }>> {
  const files: Array<{ name: string; path: string }> = [];

  async function visit(directoryPath: string): Promise<void> {
    if (files.length >= MAX_FOLDER_VIDEO_FILES) return;

    let entries: Array<fs.Dirent>;
    try {
      entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    } catch (error) {
      console.warn("[Main] Skipping unreadable folder:", directoryPath, error);
      return;
    }

    for (const entry of entries) {
      if (files.length >= MAX_FOLDER_VIDEO_FILES) return;

      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory() && recursive) {
        await visit(entryPath);
      } else if (entry.isFile() && isSupportedVideoFilePath(entryPath)) {
        files.push({ name: entry.name, path: entryPath });
      }
    }
  }

  await visit(folderPath);
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function cleanupWindows() {
  // IPCハンドラーをクリーンアップ
  ipcHandlers.forEach((removeHandler) => removeHandler());
  ipcHandlers = [];

  // ウィンドウのクリーンアップ
  if (player) {
    player.destroy();
    player = null;
  }
  if (controller) {
    controller.destroy();
    controller = null;
  }

  // Trayのクリーンアップ
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

// ファイルパスを取得するためのipcハンドラー
ipcMain.handle("get-file-path", async (event, fileInfo) => {
  if (!isTrustedAppIpcEvent(event)) {
    return { success: false, error: "Forbidden" };
  }

  console.log("[Main] get-file-path called with:", fileInfo);

  // fileInfoからパスを取得
  let filePath = fileInfo.path || "";

  if (!filePath) {
    console.error("[Main] No file path provided");
    return { success: false, error: "No file path provided" };
  }

  try {
    // パスの正規化（OSに応じた処理）
    if (os.platform() === "win32") {
      // Windowsパスの処理
      filePath = filePath.replace(/\\/g, "/");

      // Windowsの場合、ドライブレターのコロンを確認
      if (!filePath.match(/^[A-Za-z]:\//)) {
        // ドライブレターがない場合は、何らかのデフォルトパスを使用
        filePath = `C:/${filePath}`;
      }
    } else {
      // MacやLinuxの場合
      if (!filePath.startsWith("/")) {
        filePath = `/${filePath}`;
      }
    }

    // URIエンコードが必要な文字をエスケープ
    const encodedPath = encodeURI(filePath).replace(/#/g, "%23");

    // ファイルプロトコルを追加
    const fullPath = `file://${encodedPath}`;

    console.log("[Main] Resolved file path:", fullPath);
    return { success: true, path: fullPath };
  } catch (error) {
    console.error("[Main] Error resolving file path:", error);
    return { success: false, error: String(error) };
  }
});

// ファイル選択ダイアログを開くためのipcハンドラー
ipcMain.handle("show-open-dialog", async (event, options) => {
  if (!isTrustedAppIpcEvent(event)) {
    return { canceled: true, filePaths: [] };
  }

  try {
    const result = await dialog.showOpenDialog(options);
    return result;
  } catch (error) {
    console.error("[Main] Error opening dialog:", error);
    return { canceled: true, filePaths: [] };
  }
});

// フォルダ内の動画ファイルを列挙するためのipcハンドラー
ipcMain.handle("list-video-files", async (event, payload: { folderPath?: string; recursive?: boolean }) => {
  if (!isTrustedAppIpcEvent(event)) {
    return { success: false, files: [], error: "Forbidden" };
  }

  const folderPath = payload.folderPath;
  if (!folderPath || !path.isAbsolute(folderPath)) {
    return { success: false, files: [], error: "Invalid folder path" };
  }

  try {
    const stats = await fs.promises.stat(folderPath);
    if (!stats.isDirectory()) {
      return { success: false, files: [], error: "Selected path is not a folder" };
    }

    const files = await listVideoFilesInFolder(folderPath, payload.recursive ?? true);
    return { success: true, files, truncated: files.length >= MAX_FOLDER_VIDEO_FILES };
  } catch (error) {
    console.error("[Main] Error listing video files:", error);
    return { success: false, files: [], error: String(error) };
  }
});

function createWindows() {
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: "Polidium",
      submenu: [
        {
          label: "Check for Updates...",
          click() {
            autoUpdater.checkForUpdates();
          },
        },
        { type: "separator" },
        {
          label: "Reload",
          click() {
            // Controller と Player に RELOAD イベント送信
            if (controller?.win && !controller.win.isDestroyed()) {
              controller.win.webContents.reload();
            }
            if (player?.win && !player.win.isDestroyed()) {
              player.win.webContents.reload();
            }
          },
        },
        {
          label: "Reset Settings",
          click() {
            // Controller と Player に RESET イベント送信
            if (controller?.win && !controller.win.isDestroyed()) {
              controller.win.webContents.send(types.CONNECT_COMMIT, types.RESET, "{}");
            }
            if (player?.win && !player.win.isDestroyed()) {
              player.win.webContents.send(types.CONNECT_COMMIT, types.RESET, "{}");
            }
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      role: "editMenu",
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Update ready",
        message: "Update downloaded. Restart now?",
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall();
      });
  });

  // 既存のウィンドウをクリーンアップ
  cleanupWindows();

  player = new PlayerWindow();
  controller = new ControllerWindow();

  // PlayerWindowのナビゲーション状態変更コールバックを設定
  player.setNavigationStateChangeCallback((navigationState) => {
    if (controller?.win && !controller.win.isDestroyed()) {
      controller.win.webContents.send(types.CONNECT_COMMIT, types.WEB_NAVIGATION_STATE, JSON.stringify(navigationState));
    }
  });

  // PlayerWindowのナビゲーション履歴変更コールバックを設定
  player.setNavigationHistoryChangeCallback((navigationHistory) => {
    if (controller?.win && !controller.win.isDestroyed()) {
      controller.win.webContents.send(types.CONNECT_COMMIT, types.WEB_NAVIGATION_HISTORY, JSON.stringify(navigationHistory));
    }
  });

  // 保存されたウィンドウ位置とサイズを復元
  const savedBounds = loadWindowBounds();
  if (savedBounds && player.win && !player.win.isDestroyed()) {
    player.win.setBounds(savedBounds);
  }

  const trayIcon = nativeImage.createFromPath(path.join(__dirname, "../img", "trayIconTemplate.png"));
  tray = new Tray(trayIcon);

  tray.on("click", (_event, bounds) => {
    controller?.toggle(bounds.x);

    // TrayIconクリック時はプレイヤーを表示状態にする
    if (isPlayerHidden && player?.win && !player.win.isDestroyed()) {
      player.win.setOpacity(savedOpacity);
      isPlayerHidden = false;

      // Controllerにも通知
      if (controller?.win && !controller.win.isDestroyed()) {
        controller.win.webContents.send(types.CONNECT_COMMIT, types.SET_PLAYER_HIDDEN, JSON.stringify(false));
      }
    }
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
  const ipcHandler = (event: Electron.IpcMainEvent, typeName: string, payload: string) => {
    if (DEBUG) console.log(typeName, payload);

    if (!player || !controller) return;
    if (!isTrustedAppIpcEvent(event)) {
      console.warn("[Main] Rejected IPC from untrusted sender:", event.senderFrame?.url);
      return;
    }

    // 送信元のウィンドウを識別
    const isFromPlayer = event.sender === player.win?.webContents;
    const isFromController = event.sender === controller.win?.webContents;

    // 送信元でないウィンドウにのみイベントを転送
    if (isFromController) {
      // コントローラーからのイベントはプレイヤーに送信
      player.win?.webContents.send(types.CONNECT_COMMIT, typeName, payload);
    } else if (isFromPlayer) {
      // プレイヤーからのイベントはコントローラーに送信
      controller.win?.webContents.send(types.CONNECT_COMMIT, typeName, payload);
    }

    if (typeName === types.QUIT) {
      app.quit();
    }

    if (typeName === types.UPDATE_GLOBAL_SHORTCUT) {
      const shortcut = JSON.parse(payload);
      registerGlobalShortcut(shortcut);
    }

    if (typeName === types.TOGGLE_PLAYER_OPACITY) {
      togglePlayerOpacity();
    }

    if (typeName === types.SET_CLICKTHROUGH) {
      const parsedPayload = JSON.parse(payload);
      player.setIgnoreMouseEvents(parsedPayload.clickThrough);
      player.win?.setAlwaysOnTop(parsedPayload.clickThrough);
      if (MAC) player.win?.setVisibleOnAllWorkspaces(parsedPayload.clickThrough);
    }

    if (typeName === types.CHANGE_OPACITY) {
      const value = JSON.parse(payload);
      savedOpacity = value; // opacity値を保存
      player.win?.setOpacity(value);
    }

    if (typeName === types.RESIZE_PLAYER) {
      const parsedPayload: { mode: boolean } = JSON.parse(payload);

      if (player.win && !player.win.isDestroyed()) {
        if (parsedPayload.mode) {
          player.win?.focus();
        } else {
          player.win?.blur();
          const bounds = player.win.getBounds();
          saveWindowBounds(bounds);
        }

        player.setIgnoreMouseEvents(!parsedPayload.mode);
        player.win?.setAlwaysOnTop(true);
        if (MAC) player.win?.setVisibleOnAllWorkspaces(true);
        player.win?.setResizable(parsedPayload.mode);
        player.win?.setMovable(parsedPayload.mode);
        if (MAC) player.win?.setHasShadow(parsedPayload.mode);

        // resize modeの状態を設定
        player.setResizeMode(parsedPayload.mode);
      }
    }

    if (typeName === types.OPEN_URL) {
      const parsed = JSON.parse(payload);
      player.openUrl(parsed.src);
    }

    if (typeName === types.WEB_GO_BACK) {
      player.goBack();
    }

    if (typeName === types.WEB_GO_FORWARD) {
      player.goForward();
    }

    if (typeName === types.WEB_RELOAD) {
      player.reloadWebView();
    }

    if (typeName === types.WEB_GO_TO_INDEX) {
      const parsed = JSON.parse(payload);
      player.goToIndex(parsed.index);
    }

    if (typeName === types.CHANGE_MODE) {
      const mode = JSON.parse(payload);
      player.setMode(mode);
      if (mode === "video-player") player.destroyWebView(); // WebContentsViewを完全破棄してメディア停止
      if (mode === "web-player") player.showWebView();
    }

    if (typeName === types.RESET) {
      // Settings リセット処理は各ウィンドウで処理される
      // メインプロセスでは特別な処理は不要
    }

    if (typeName === types.PLAY_FILE) {
      // 動画ファイル再生時に適切なモードに切り替え
      player.hideWebView();

      // ファイル情報を解析して、プレイヤーに送り直す
      try {
        const parsedPayload = JSON.parse(payload);
        if (parsedPayload.file) {
          // ファイル情報を取得
          const filePath = parsedPayload.file.path || "";
          const fileName = parsedPayload.file.name || "";
          const startTime = typeof parsedPayload.startTime === "number" ? parsedPayload.startTime : 0;

          // パスが有効かどうかチェック
          if (filePath) {
            console.log(`[Main] Processing video file: ${parsedPayload.name}, path: ${filePath}`);

            const mediaUrl = createMediaUrlForFile(filePath, fileName);

            // ファイル情報をmedia://プロトコルでプレイヤーに送信
            console.log(`[Main] Sending file to player: ${parsedPayload.name}, ${mediaUrl}`);
            player.win?.webContents.send(
              types.CONNECT_COMMIT,
              types.PLAY_FILE,
              JSON.stringify({
                file: {
                  name: fileName,
                  path: mediaUrl,
                },
                startTime,
              }),
            );
          } else {
            console.error("[Main] No valid file path provided");
          }
        } else {
          console.error("[Main] No file information in payload");
        }
      } catch (error) {
        console.error("Failed to parse PLAY_FILE payload:", error);
      }
    }
  };

  // 既存のリスナーを削除してから新しいリスナーを追加
  ipcMain.removeAllListeners(types.CONNECT_COMMIT);
  ipcMain.on(types.CONNECT_COMMIT, ipcHandler);
}

app.whenReady().then(() => {
  registerProtocolHandlers();
  configureSessionSecurity();
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
  // グローバルショートカットをアンレジスター
  if (currentGlobalShortcut) {
    globalShortcut.unregister(currentGlobalShortcut);
  }
  cleanupWindows();
});

// グローバルショートカット関連の関数
function registerGlobalShortcut(shortcut: string) {
  // 既存のショートカットをアンレジスター
  if (currentGlobalShortcut) {
    globalShortcut.unregister(currentGlobalShortcut);
  }

  // 新しいショートカットを登録
  const registered = globalShortcut.register(shortcut, () => {
    togglePlayerOpacity();
  });

  if (registered) {
    currentGlobalShortcut = shortcut;
    console.log(`Global shortcut registered: ${shortcut}`);
  } else {
    console.error(`Failed to register global shortcut: ${shortcut}`);
  }
}

function togglePlayerOpacity() {
  if (!player?.win || player.win.isDestroyed()) return;

  if (isPlayerHidden) {
    // 表示する
    player.win.setOpacity(savedOpacity);
    isPlayerHidden = false;
  } else {
    // 非表示にする
    player.win.setOpacity(0);
    isPlayerHidden = true;
  }

  // Controllerに状態を通知
  if (controller?.win && !controller.win.isDestroyed()) {
    controller.win.webContents.send(types.CONNECT_COMMIT, types.SET_PLAYER_HIDDEN, JSON.stringify(isPlayerHidden));
  }
}

// アプリ起動時にデフォルトのショートカットを登録
app.whenReady().then(() => {
  // デフォルトショートカットはControllerから設定される
});
