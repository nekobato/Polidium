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
      controls
      autoplay
    />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';

const store = useStore();

const videoSource = (): string => {
  if (!store.state.video.source.path) {
    return '';
  }
  return 'file://' + store.state.video.source.path;
};

const onVideoCanplay = () => {};
const onVideoTimeupdate = () => {};
const onVideoPlay = () => {};
const onVideoPause = () => {};
const onVideoEnded = () => {};
const onVideoLoadStart = () => {};
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
