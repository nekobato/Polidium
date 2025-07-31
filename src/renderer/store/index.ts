import { createPinia } from "pinia";
import * as types from "@/mutation-types";
import * as Sentry from "@sentry/electron";
import { useVideoStore } from "./modules/video";
import { useWebStore } from "./modules/web";
import { useSettingsStore } from "./modules/settings";
import { usePlayerStore } from "./modules/player";
import ipc from "@/renderer/ipc";

const { VITE_SENTRY_DSN } = import.meta.env;

if (VITE_SENTRY_DSN) {
  Sentry.init({ dsn: VITE_SENTRY_DSN });
}

export const pinia = createPinia();

// Controller window用のストア
const videoStore = useVideoStore(pinia);
const webStore = useWebStore(pinia);
const settingsStore = useSettingsStore(pinia);

// Player window用のストア
const playerStore = usePlayerStore(pinia);

// Controller window用のコミットマップ
const controllerCommitMap: Record<string, (payload: any) => void> = {
  [types.VIDEO_CANPLAY]: (payload) => videoStore.videoCanplay(payload),
  [types.VIDEO_TIMEUPDATE]: (payload) => videoStore.videoTimeupdate(payload),
  [types.VIDEO_SEEK]: (payload) => videoStore.videoSeek(payload),
  [types.VIDEO_PLAYED]: () => videoStore.videoPlayed(),
  [types.VIDEO_PAUSED]: () => videoStore.videoPaused(),
  [types.VIDEO_ENDED]: () => videoStore.videoEnded(),
  [types.RELOAD]: () => settingsStore.reload(),
  [types.RESET]: () => settingsStore.reset(),
  [types.RESIZED_PLAYER]: () => settingsStore.resizePlayer({ mode: false }),
};

// Player window用のコミットマップ
const playerCommitMap: Record<string, (payload: any) => void> = {
  [types.PLAY_FILE]: (payload) => playerStore.openFile(payload.file),
  [types.CHANGE_MODE]: (mode) => playerStore.changeMode(mode),
  [types.CHANGE_OPACITY]: (value) => playerStore.changeOpacity(value),
  [types.SET_CLICKTHROUGH]: (payload) => playerStore.setClickthrough(payload.clickThrough),
  [types.RESIZE_PLAYER]: (payload) => playerStore.setResizeMode(payload.mode),
  [types.VIDEO_SEEK]: (payload) => playerStore.seekVideo(payload.percentage),
  [types.PAUSE_FILE]: () => playerStore.pauseVideo(),
  [types.RESUME_FILE]: () => playerStore.resumeVideo(),
  [types.OPEN_URL]: (payload) => playerStore.openUrl(payload.src),
  [types.RELOAD]: () => window.location.reload(),
  [types.RESET]: () => {
    localStorage.clear();
    window.location.reload();
  },
};

// 現在のウィンドウがPlayerかControllerかを判定
const isPlayerWindow = window.location.pathname.includes("/player");
const commitMap = isPlayerWindow ? playerCommitMap : controllerCommitMap;

ipc.on(types.CONNECT_COMMIT, (...args: unknown[]) => {
  const [typeName, payload] = args as [string, string];
  console.log(`[IPC received] ${typeName}`, payload);
  const handler = commitMap[typeName];
  if (handler) handler(JSON.parse(payload));
});

export { useVideoStore, useWebStore, useSettingsStore, usePlayerStore };
