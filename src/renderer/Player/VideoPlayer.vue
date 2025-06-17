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
import { useVideoStore } from "@/renderer/store/modules/video";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

const videoStore = useVideoStore();
const video = ref<HTMLVideoElement | null>(null);
const videoEl = ref<HTMLVideoElement | null>(null);

const currentFile = computed(() => videoStore.currentFile);
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
const videoState = computed(() => videoStore.video);

// 変数削除

// コンポーネントがマウントされたときにビデオ要素への参照を設定
onMounted(() => {
  videoEl.value = video.value;

  // メインプロセスからのPLAY_FILEメッセージをリッスン
  ipc.on(types.CONNECT_COMMIT, (typeName: string, payload: string) => {
    if (typeName === types.PLAY_FILE) {
      try {
        const data = JSON.parse(payload);
        if (data.file && data.file.path) {
          console.log("[VideoPlayer] Received file from main process:", data.file);

          // ストアを更新して再生を開始
          videoStore.setCurrentFile({ file: data.file });
        }
      } catch (error) {
        console.error("[VideoPlayer] Failed to parse PLAY_FILE payload:", error);
      }
    }
  });
});

// コンポーネントがアンマウントされるときにクリーンアップ
onUnmounted(() => {
  // イベントリスナーを削除
  ipc.removeListener(types.CONNECT_COMMIT, () => {});
});

watch(
  () => videoState.value.seekPercentage,
  (value) => {
    if (videoEl.value) {
      videoEl.value.currentTime = (videoState.value.duration / 100) * value;
    }
  },
);

watch(
  () => videoState.value.switch,
  (value) => {
    if (!videoEl.value) return;
    if (value === true) {
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
  videoStore.videoCanplay({ duration: videoEl.value!.duration });
}

function onVideoTimeupdate() {
  const current = videoEl.value!.currentTime;
  videoStore.videoTimeupdate({
    currentTime: current,
  });
  ipc.commit(types.VIDEO_TIMEUPDATE, {
    currentTime: current,
  });
}

function onVideoPlay() {
  videoStore.videoPlayed();
}

function onVideoPause() {
  videoStore.videoPaused();
}

function onVideoEnded() {
  videoStore.videoEnded();
}

function onVideoLoadStart() {
  videoStore.videoPaused();
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
