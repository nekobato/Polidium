<template>
  <webview class="web-player" nodeintegration :src="web.src"></webview>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const web = computed(() => store.state.web)
</script>

<style lang="scss" scoped>
.web-player {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>

