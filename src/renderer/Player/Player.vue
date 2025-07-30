<template>
  <div class="player" :style="playerStyle">
    <router-view />
    <resize-mode v-if="playerStore.resizeMode" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import type { CSSProperties } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/renderer/store/modules/player";
import ResizeMode from "./ResizeMode.vue";

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

// 初期化時にBrowserWindowにopacityを設定
onMounted(() => {
  console.log("[Player]");
  // 起動時は必ずresizeModeをfalseに設定
  playerStore.setResizeMode(false);
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
