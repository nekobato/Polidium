<template>
  <webview class="web-player" nodeintegration :src="web.src"></webview>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWebStore } from "@/renderer/store/modules/web";

const webStore = useWebStore();
const web = computed(() => webStore);
</script>

<style lang="scss" scoped>
.web-player {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
