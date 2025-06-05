<template>
  <div class="player" :style="playerStyle">
    <router-view />
    <resize-mode v-show="settings.resizeMode" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import type { CSSProperties } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import ResizeMode from "./ResizeMode.vue";

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.player);
const router = useRouter();
const playerStyle = computed<CSSProperties>(() => ({
  opacity: settings.value.resizeMode ? 1 : settings.value.opacity,
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
