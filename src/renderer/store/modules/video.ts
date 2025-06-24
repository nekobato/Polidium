import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref, reactive } from "vue";

// キューアイテムの型定義
interface QueueItem {
  name: string;
  path: string; // 絶対パス
}

export const useVideoStore = defineStore("video", () => {
  // キューアイテムの配列として保存
  const queues = useStorage<Array<QueueItem>>("queues", []);
  const playPointer = ref<number | null>(null);
  const currentFile = ref<QueueItem | null>(null);
  const video = reactive({
    duration: 0,
    currentTime: 0,
    seekPercentage: 0,
    isPlaying: false,
    switch: false, // switch play/pause control by controller
  });

  function dropFile(payload: { file: QueueItem | { name: string; path: string } }) {
    // 完全なQueueItemを作成して追加
    const queueItem: QueueItem = {
      name: payload.file.name,
      path: payload.file.path,
    };

    console.log("Adding file to queue:", queueItem);
    queues.value.push(queueItem);
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
  }

  function removeQueue(payload: { index: number }) {
    queues.value.splice(payload.index, 1);
  }

  function clearQueues() {
    queues.value = [];
  }

  function sortQueue(payload: { oldIndex: number; newIndex: number }) {
    const newRow = queues.value.splice(payload.newIndex, 1, null as any)[0];
    queues.value.splice(payload.newIndex, 1, queues.value[payload.oldIndex]);
    queues.value.splice(payload.oldIndex, 1, newRow);
  }

  function videoCanplay(payload: { duration: number }) {
    video.duration = payload.duration;
    video.switch = true;
    // 再生可能になったら自動的に再生を開始する
    setTimeout(() => {
      video.switch = true;
    }, 100);
  }

  function videoTimeupdate(payload: { currentTime: number }) {
    video.currentTime = payload.currentTime;
  }

  function videoSeek(payload: { percentage: number }) {
    video.seekPercentage = payload.percentage;
  }

  function videoPlayed() {
    video.isPlaying = true;
    video.switch = true;
  }

  function videoPaused() {
    video.isPlaying = false;
    video.switch = false;
  }

  function videoEnded() {
    if (queues.value[(playPointer.value ?? -1) + 1]) {
      playPointer.value = (playPointer.value ?? -1) + 1;
      currentFile.value = queues.value[playPointer.value] ?? null;
    }
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

      // ファイルが設定されたら、自動的に再生スイッチをオンにする
      setTimeout(() => {
        video.switch = true;
      }, 100);
    } else {
      console.warn("Invalid file payload received:", payload);
    }
  }

  return {
    queues,
    playPointer,
    currentFile,
    video,
    dropFile,
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
  };
});
