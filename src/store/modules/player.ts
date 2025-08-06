import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as types from "@/mutation-types";
import ipc from "@/ipc";

interface VideoFile {
  name: string;
  path: string;
}

export const usePlayerStore = defineStore("player", () => {
  // Settings
  const mode = ref<string>("video-player");
  const opacity = ref<number>(0.05);
  const clickThrough = ref<boolean>(true);
  const resizeMode = ref<boolean>(false);

  // Video
  const currentFile = ref<VideoFile | null>(null);
  const isPlaying = ref<boolean>(false);
  const duration = ref<number>(0);
  const currentTime = ref<number>(0);

  // Web
  const currentUrl = ref<string>("");

  // 計算プロパティ
  const isVideoMode = computed(() => mode.value === "video-player");
  const isWebMode = computed(() => mode.value === "web-player");

  // アクション
  function changeMode(newMode: string) {
    mode.value = newMode;
  }

  function changeOpacity(newOpacity: number) {
    if (opacity.value === newOpacity) return;

    opacity.value = newOpacity;
  }

  function setClickthrough(isClickThrough: boolean) {
    clickThrough.value = isClickThrough;
  }

  function setResizeMode(isResizeMode: boolean) {
    if (resizeMode.value === isResizeMode) return;

    console.log(`[Player] Resize mode: ${isResizeMode}`);

    resizeMode.value = isResizeMode;
    clickThrough.value = !isResizeMode;
  }

  // ビデオ関連のアクション
  function openFile(file: VideoFile | null) {
    currentFile.value = file;
  }

  function onVideoCanplay(videoDuration: number) {
    duration.value = videoDuration;
    ipc.commit(types.VIDEO_CANPLAY, { duration: videoDuration });
  }

  function onVideoTimeupdate(time: number) {
    currentTime.value = time;
    ipc.commit(types.VIDEO_TIMEUPDATE, { currentTime: time });
  }

  function onVideoPlay() {
    isPlaying.value = true;
    ipc.commit(types.VIDEO_PLAYED);
  }

  function onVideoPause() {
    isPlaying.value = false;
    ipc.commit(types.VIDEO_PAUSED);
  }

  function onVideoEnded() {
    isPlaying.value = false;
    ipc.commit(types.VIDEO_ENDED);
  }

  function seekVideo(percentage: number) {
    // Seek操作を受信（Controller側からの操作）
    const seekTime = (duration.value * percentage) / 100;
    return seekTime;
  }

  function pauseVideo() {
    // 一時停止を受信
    isPlaying.value = false;
  }

  function resumeVideo() {
    // 再生を受信
    isPlaying.value = true;
  }

  // Web関連のアクション
  function openUrl(url: string) {
    currentUrl.value = url;
  }

  return {
    // 状態
    mode,
    opacity,
    clickThrough,
    resizeMode,
    currentFile,
    isPlaying,
    duration,
    currentTime,
    currentUrl,

    // 計算プロパティ
    isVideoMode,
    isWebMode,

    // IPCから来たアクションのハンドラ
    changeMode,
    changeOpacity,
    setClickthrough,
    setResizeMode,
    openFile,
    seekVideo,
    pauseVideo,
    resumeVideo,
    openUrl,

    // IPCへのアクション
    onVideoCanplay,
    onVideoTimeupdate,
    onVideoPlay,
    onVideoPause,
    onVideoEnded,
  };
});
