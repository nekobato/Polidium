<template>
  <video
    ref="video"
    class="video"
    :src="videoSource"
    autoplay
    @canplay="onVideoCanplay"
    @timeupdate="onVideoTimeupdate"
    @play="onVideoPlay"
    @pause="onVideoPause"
    @ended="onVideoEnded"
    @loadstart="onVideoLoadStart"
  ></video>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { usePlayerStore } from "@/store/modules/player";
import ipc from "@/ipc";
import * as types from "@/mutation-types";

const playerStore = usePlayerStore();
const video = ref<HTMLVideoElement | null>(null);
const videoEl = ref<HTMLVideoElement | null>(null);

const currentFile = computed(() => playerStore.currentFile);
const videoSource = computed(() => {
  // currentFileが設定されている場合の処理
  if (currentFile.value) {
    console.log("Current file:", currentFile.value);

    // pathプロパティが存在する場合はそれを使用
    if (currentFile.value.path) {
      const filePath = currentFile.value.path;
      return filePath;
    }
  }

  return ""; // ファイルが設定されていない場合は空文字列
});

// 変数削除

// コンポーネントがマウントされたときにビデオ要素への参照を設定
onMounted(() => {
  videoEl.value = video.value;

  // メインプロセスからのPLAY_FILEメッセージをリッスン
  ipc.on(types.CONNECT_COMMIT, (...args: unknown[]) => {
    const [typeName, payload] = args as [string, string];
    if (typeName === types.PLAY_FILE) {
      try {
        const data = JSON.parse(payload);
        if (data.file && data.file.path) {
          console.log("[VideoPlayer] Received file from main process:", data.file);

          // ストアを更新して再生を開始
          playerStore.openFile(data.file);
        }
      } catch (error) {
        console.error("[VideoPlayer] Failed to parse PLAY_FILE payload:", error);
      }
    }

    // Controllerからのビデオ制御コマンドを処理
    if (typeName === types.VIDEO_SEEK) {
      const data = JSON.parse(payload);
      const seekTime = playerStore.seekVideo(data.percentage);
      if (videoEl.value) {
        videoEl.value.currentTime = seekTime;
      }
    }

    if (typeName === types.PAUSE_FILE) {
      playerStore.pauseVideo();
      if (videoEl.value) {
        videoEl.value.pause();
      }
    }

    if (typeName === types.RESUME_FILE) {
      playerStore.resumeVideo();
      if (videoEl.value) {
        videoEl.value.play();
      }
    }
  });
});

// コンポーネントがアンマウントされるときにクリーンアップ
onUnmounted(() => {
  // イベントリスナーを削除
  ipc.removeListener(types.CONNECT_COMMIT, () => {});
});

// Playerストアの状態変化を監視
watch(
  () => playerStore.isPlaying,
  (playing) => {
    if (!videoEl.value) return;
    if (playing) {
      videoEl.value.play();
    } else {
      videoEl.value.pause();
    }
  },
);

// 現在のファイルが変更されたときに自動的に再生を開始
watch(
  () => currentFile.value,
  (newFile) => {
    if (newFile && videoEl.value) {
      console.log("[VideoPlayer] Current file changed:", newFile, videoEl.value.src);
      // ファイルが変更されたら少し待ってから再生（srcの更新を待つため）
      setTimeout(() => {
        if (videoEl.value) videoEl.value.play();
      }, 100);
    }
  },
);

function onVideoCanplay() {
  if (videoEl.value) {
    playerStore.onVideoCanplay(videoEl.value.duration);
  }
}

function onVideoTimeupdate() {
  if (videoEl.value) {
    playerStore.onVideoTimeupdate(videoEl.value.currentTime);
  }
}

function onVideoPlay() {
  playerStore.onVideoPlay();
}

function onVideoPause() {
  playerStore.onVideoPause();
}

function onVideoEnded() {
  playerStore.onVideoEnded();
}

function onVideoLoadStart() {
  playerStore.onVideoPause();
}
</script>

<style lang="scss" scoped>
.video {
  margin: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
