<template>
  <div class="player" :style="playerStyle">
    <component :is="settings.mode" />
    <resize-mode v-show="settings.resizeMode" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import VideoPlayer from './VideoPlayer.vue'
import WebPlayer from './WebPlayer.vue'
import ResizeMode from './ResizeMode.vue'

const store = useStore()

const settings = computed(() => store.state.settings.player)
const playerStyle = computed(() => ({
  opacity: settings.value.resizeMode ? 1 : settings.value.opacity,
  'pointer-events': settings.value.clickThrough ? 'none' : 'auto'
}))
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

