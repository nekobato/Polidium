<template>
  <div class="video-container">
    <video
      class="video"
      ref="video"
      :src="videoSource"
      @canplay="onVideoCanplay"
      @timeupdate="onVideoTimeupdate"
      @play="onVideoPlay"
      @pause="onVideoPause"
      @ended="onVideoEnded"
      @loadstart="onVideoLoadStart"
      autoplay
    />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import * as types from '@/../../mutation-types';

const store = useStore();

const video = ref<HTMLAudioElement>();

const videoSource = computed((): string => {
  if (!store.state.video.source.path) {
    return '';
  }
  return 'file://' + store.state.video.source.path;
});

const onVideoCanplay = () => {};
const onVideoTimeupdate = () => {};
const onVideoPlay = () => {};
const onVideoPause = () => {};
const onVideoEnded = () => {};
const onVideoLoadStart = () => {};

onMounted(() => {
  window.ipc.on(types.VIDEO_PLAY, () => {
    video.value?.play();
  });
  window.ipc.on(types.VIDEO_PAUSE, () => {
    video.value?.pause();
  });
  window.ipc.on(types.VIDEO_SELECT, (_, file: { name: string; path: string }) => {
    store.commit(types.SET_VIDEO_SOURCE, file);
  });
});
</script>

<style scoped>
.video-container {
  height: 100%;
  background: #000;
}
.video {
  height: 100%;
  width: 100%;
  outline: none;
  object-fit: contain;
}
</style>
