<template>
  <div class="player" :style="playerStyle">
    <router-view />
    <resize-mode v-if="settings.resizeMode" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import type { CSSProperties } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";
import ResizeMode from "./ResizeMode.vue";

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.player);
const router = useRouter();
const playerStyle = computed<CSSProperties>(() => ({
  pointerEvents: settings.value.clickThrough ? "none" : "auto"
}));

watch(
  () => settings.value.mode,
  (mode) => {
    if (mode === "video-player") router.push("/player/file");
    else if (mode === "web-player") router.push("/player/web");
  },
  { immediate: true }
);

// 初期化時にBrowserWindowにopacityを設定
onMounted(() => {
  // 起動時は必ずresizeModeをfalseに設定
  settingsStore.resizePlayer({ mode: false });

  // opacityの設定（resizeModeがfalseなので、通常のopacityが適用される）
  ipc.commit(types.CHANGE_OPACITY, settings.value.opacity);
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
