import { createPinia } from "pinia";
import * as types from "@/mutation-types";
import * as Sentry from "@sentry/electron";
import { useVideoStore } from "./modules/video";
import { useWebStore } from "./modules/web";
import { useSettingsStore } from "./modules/settings";

const ipc = (window as any).electronAPI;

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

export const pinia = createPinia();

const videoStore = useVideoStore(pinia);
const webStore = useWebStore(pinia);
const settingsStore = useSettingsStore(pinia);

const commitMap: Record<string, (payload: any) => void> = {
  [types.DROP_FILE]: (payload) => videoStore.dropFile(payload),
  [types.PAUSE_FILE]: () => videoStore.pauseFile(),
  [types.RESUME_FILE]: () => videoStore.resumeFile(),
  [types.VIDEO_SELECT]: (payload) => {
    videoStore.selectVideo(payload);
    settingsStore.videoSelect();
  },
  [types.REMOVE_QUEUE]: (payload) => videoStore.removeQueue(payload),
  [types.CLEAR_QUEUES]: () => videoStore.clearQueues(),
  [types.SORT_QUEUE]: (payload) => videoStore.sortQueue(payload),
  [types.VIDEO_CANPLAY]: (payload) => videoStore.videoCanplay(payload),
  [types.VIDEO_TIMEUPDATE]: (payload) => videoStore.videoTimeupdate(payload),
  [types.VIDEO_SEEK]: (payload) => videoStore.videoSeek(payload),
  [types.VIDEO_PLAYED]: () => videoStore.videoPlayed(),
  [types.VIDEO_PAUSED]: () => videoStore.videoPaused(),
  [types.VIDEO_ENDED]: () => videoStore.videoEnded(),
  [types.CHANGE_MODE]: (mode) => settingsStore.changeMode(mode),
  [types.CHANGE_OPACITY]: (value) => settingsStore.changeOpacity(value),
  [types.SET_CLICKTHROUGH]: (payload) => settingsStore.setClickthrough(payload),
  [types.RELOAD]: () => settingsStore.reload(),
  [types.RESET]: () => settingsStore.reset(),
  [types.OPEN_URL]: (payload) => {
    webStore.openUrl(payload);
    settingsStore.openUrl();
  },
  [types.RESIZE_PLAYER]: (payload) => settingsStore.resizePlayer(payload)
};

ipc.on(types.CONNECT_COMMIT, (typeName: string, payload: string) => {
  const handler = commitMap[typeName];
  if (handler) handler(JSON.parse(payload));
});

export { useVideoStore, useWebStore, useSettingsStore };
