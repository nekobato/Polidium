<template>
  <video
    ref="video"
    class="video"
    :src="videoSource"
    @canplay="onVideoCanplay"
    @timeupdate="onVideoTimeupdate"
    @play="onVideoPlay"
    @pause="onVideoPause"
    @ended="onVideoEnded"
    @loadstart="onVideoLoadStart"
  ></video>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useVideoStore } from "@/renderer/store/modules/video";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

const videoStore = useVideoStore();
const videoEl = ref<HTMLVideoElement | null>(null);

const currentFile = computed(() => videoStore.currentFile);
const videoSource = computed(() => currentFile.value ? currentFile.value.path : "");
const video = computed(() => videoStore.video);

watch(
  () => video.value.seekPercentage,
  (value) => {
    if (videoEl.value) {
      videoEl.value.currentTime = (video.value.duration / 100) * value;
    }
  }
);

watch(
  () => video.value.switch,
  (value) => {
    if (!videoEl.value) return;
    if (value === true) {
      videoEl.value.play();
    } else {
      videoEl.value.pause();
    }
  }
);

function onVideoCanplay() {
  videoStore.videoCanplay({ duration: videoEl.value!.duration });
}

function onVideoTimeupdate() {
  const current = videoEl.value!.currentTime;
  videoStore.videoTimeupdate({
    currentTime: current
  });
  ipc.commit(types.VIDEO_TIMEUPDATE, {
    currentTime: current
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
