import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref, reactive, computed } from "vue";

// キューアイテムの型定義
interface QueueItem {
  name: string;
  path: string; // 絶対パス
}

type PlaybackMode = "sequence" | "repeat-all" | "repeat-one" | "shuffle";

const MAX_RECENT_FILES = 12;
const POSITION_SAVE_INTERVAL_SECONDS = 5;

/**
 * Builds a deduplicated recent-files list with newest entries first.
 */
function mergeRecentFiles(currentFiles: Array<QueueItem>, files: Array<QueueItem>): Array<QueueItem> {
  const uniqueFiles = [...files, ...currentFiles].reduce<Array<QueueItem>>((items, file) => {
    if (!file.path || items.some((item) => item.path === file.path)) return items;
    return [...items, file];
  }, []);

  return uniqueFiles.slice(0, MAX_RECENT_FILES);
}

export const useVideoStore = defineStore("video", () => {
  // キューアイテムの配列として保存
  const queues = useStorage<Array<QueueItem>>("queues", []);
  const recentFiles = useStorage<Array<QueueItem>>("recentFiles", []);
  const playbackPositions = useStorage<Record<string, number>>("playbackPositions", {});
  const playbackMode = useStorage<PlaybackMode>("playbackMode", "sequence");
  const volume = useStorage<number>("videoVolume", 1);
  const muted = useStorage<boolean>("videoMuted", false);
  const playbackRate = useStorage<number>("videoPlaybackRate", 1);
  const playPointer = ref<number | null>(null);
  const currentFile = ref<QueueItem | null>(null);
  const lastPositionSaveSecond = ref<number>(0);
  const video = reactive({
    duration: 0,
    currentTime: 0,
    seekPercentage: 0,
    isPlaying: false,
    switch: false, // switch play/pause control by controller
    error: "",
  });

  const hasRecentFiles = computed(() => recentFiles.value.length > 0);

  function dropFile(payload: { file: QueueItem | { name: string; path: string } }) {
    // 完全なQueueItemを作成して追加
    const queueItem: QueueItem = {
      name: payload.file.name,
      path: payload.file.path,
    };

    console.log("Adding file to queue:", queueItem);
    queues.value.push(queueItem);
    addRecentFiles([queueItem]);
  }

  function addQueues(files: Array<QueueItem | { name: string; path: string }>) {
    const queueItems = files.map((file) => ({
      name: file.name,
      path: file.path,
    }));

    queues.value.push(...queueItems);
    addRecentFiles(queueItems);
  }

  function pauseFile() {
    video.switch = false;
    video.isPlaying = false;
  }

  function resumeFile() {
    video.switch = true;
    video.isPlaying = true;
  }

  function selectVideo(payload: { index: number }) {
    playPointer.value = payload.index;
    currentFile.value = queues.value[payload.index] ?? null;
    video.error = "";
  }

  function removeQueue(payload: { index: number }) {
    queues.value.splice(payload.index, 1);
    if (playPointer.value === payload.index) {
      playPointer.value = null;
      currentFile.value = null;
    } else if (playPointer.value !== null && playPointer.value > payload.index) {
      playPointer.value -= 1;
    }
  }

  function clearQueues() {
    queues.value = [];
    playPointer.value = null;
    currentFile.value = null;
  }

  function sortQueue(payload: { oldIndex: number; newIndex: number }) {
    const newRow = queues.value.splice(payload.newIndex, 1, null as any)[0];
    queues.value.splice(payload.newIndex, 1, queues.value[payload.oldIndex]);
    queues.value.splice(payload.oldIndex, 1, newRow);
  }

  function videoCanplay(payload: { duration: number }) {
    video.duration = payload.duration;
    video.switch = true;
    video.error = "";
    // 再生可能になったら自動的に再生を開始する
    setTimeout(() => {
      video.switch = true;
    }, 100);
  }

  function videoTimeupdate(payload: { currentTime: number }) {
    video.currentTime = payload.currentTime;
    saveCurrentPlaybackPosition(payload.currentTime);
  }

  function videoSeek(payload: { percentage: number }) {
    video.seekPercentage = payload.percentage;
  }

  function videoPlayed() {
    video.isPlaying = true;
    video.switch = true;
  }

  function videoPaused(payload?: { currentTime?: number }) {
    video.isPlaying = false;
    video.switch = false;
    if (typeof payload?.currentTime === "number") {
      saveCurrentPlaybackPosition(payload.currentTime, true);
    }
  }

  function videoEnded() {
    video.isPlaying = false;
    video.switch = false;
    if (currentFile.value) clearPlaybackPosition(currentFile.value.path);
  }

  function addQueue(file: QueueItem | { name: string; path: string }) {
    // dropFileと同じ処理を実行
    dropFile({ file });
  }

  function setCurrentFile(payload: { file: QueueItem | null }) {
    // ファイルが指定されていて、パスが存在する場合のみ設定
    if (payload.file && payload.file.path) {
      console.log("Setting current file to:", payload.file);

      // QueueItemとしてセット
      currentFile.value = {
        name: payload.file.name,
        path: payload.file.path,
      };
      video.error = "";

      // ファイルが設定されたら、自動的に再生スイッチをオンにする
      setTimeout(() => {
        video.switch = true;
      }, 100);
    } else {
      console.warn("Invalid file payload received:", payload);
    }
  }

  function setPlaybackMode(mode: PlaybackMode) {
    playbackMode.value = mode;
  }

  function setVolume(newVolume: number) {
    volume.value = Math.min(1, Math.max(0, newVolume));
    if (volume.value > 0 && muted.value) muted.value = false;
  }

  function setMuted(isMuted: boolean) {
    muted.value = isMuted;
  }

  function setPlaybackRate(rate: number) {
    playbackRate.value = rate;
  }

  function addRecentFiles(files: Array<QueueItem>) {
    recentFiles.value = mergeRecentFiles(recentFiles.value, files);
  }

  function clearRecentFiles() {
    recentFiles.value = [];
  }

  function getPlaybackPosition(filePath: string): number {
    return playbackPositions.value[filePath] ?? 0;
  }

  function saveCurrentPlaybackPosition(currentTime: number, force = false) {
    if (!currentFile.value) return;
    if (!Number.isFinite(currentTime)) return;
    if (currentTime < 1) return;

    const wholeSecond = Math.floor(currentTime);
    if (!force && wholeSecond - lastPositionSaveSecond.value < POSITION_SAVE_INTERVAL_SECONDS) return;

    lastPositionSaveSecond.value = wholeSecond;
    playbackPositions.value = {
      ...playbackPositions.value,
      [currentFile.value.path]: wholeSecond,
    };
  }

  function clearPlaybackPosition(filePath: string) {
    const nextPositions = { ...playbackPositions.value };
    delete nextPositions[filePath];
    playbackPositions.value = nextPositions;
  }

  function setVideoError(payload: { message: string }) {
    video.error = payload.message;
    video.isPlaying = false;
    video.switch = false;
  }

  function clearVideoError() {
    video.error = "";
  }

  return {
    queues,
    recentFiles,
    hasRecentFiles,
    playbackPositions,
    playbackMode,
    volume,
    muted,
    playbackRate,
    playPointer,
    currentFile,
    video,
    dropFile,
    addQueues,
    addQueue,
    pauseFile,
    resumeFile,
    selectVideo,
    removeQueue,
    clearQueues,
    sortQueue,
    videoCanplay,
    videoTimeupdate,
    videoSeek,
    videoPlayed,
    videoPaused,
    videoEnded,
    setCurrentFile,
    setPlaybackMode,
    setVolume,
    setMuted,
    setPlaybackRate,
    addRecentFiles,
    clearRecentFiles,
    getPlaybackPosition,
    clearPlaybackPosition,
    setVideoError,
    clearVideoError,
  };
});
