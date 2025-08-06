<template>
  <div class="player" :style="playerStyle">
    <router-view />
    <resize-mode v-if="playerStore.resizeMode" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from "vue";
import type { CSSProperties } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/store/modules/player";
import ResizeMode from "./ResizeMode.vue";
import ipc from "@/ipc";
import * as types from "@/mutation-types";

const playerStore = usePlayerStore();
const router = useRouter();
const playerStyle = computed<CSSProperties>(() => ({
  pointerEvents: playerStore.clickThrough ? "none" : "auto",
}));

watch(
  () => playerStore.mode,
  (mode) => {
    if (mode === "video-player") router.push("/player/file");
    else if (mode === "web-player") router.push("/player/web");
  },
  { immediate: true },
);

// IPCイベントハンドラー
const handleConnectCommit = (...args: unknown[]) => {
  const [typeName, payload] = args as [string, string];
  console.log(`[Player] Received IPC event: ${typeName}`, payload);

  if (typeName === types.RESIZE_PLAYER) {
    const parsedPayload = JSON.parse(payload);
    playerStore.setResizeMode(parsedPayload.mode);
  }
};

// 初期化時にBrowserWindowにopacityを設定
onMounted(() => {
  console.log("[Player]");
  // 起動時は必ずresizeModeをfalseに設定
  playerStore.setResizeMode(false);

  // IPCイベントリスナーを登録
  ipc.on(types.CONNECT_COMMIT, handleConnectCommit);
});

// クリーンアップ
onUnmounted(() => {
  ipc.removeListener(types.CONNECT_COMMIT, handleConnectCommit);
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}
</style>

<style lang="scss" scoped>
.player {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
