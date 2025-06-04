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
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import ipc from 'renderer/ipc'
import * as types from 'root/mutation-types'

const store = useStore()
const videoEl = ref(null)

const queues = computed(() => store.state.video.queues)
const playPointer = computed(() => store.state.video.playPointer)
const videoSource = computed(() => {
  return queues.value[playPointer.value] ? queues.value[playPointer.value].path : ''
})
const video = computed(() => store.state.video.video)

watch(() => video.value.seekPercentage, (value) => {
  if (videoEl.value) {
    videoEl.value.currentTime = (video.value.duration / 100) * value
  }
})

watch(() => video.value.switch, (value) => {
  if (!videoEl.value) return
  if (value === true) {
    videoEl.value.play()
  } else {
    videoEl.value.pause()
  }
})

function onVideoCanplay () {
  ipc.commit(types.VIDEO_CANPLAY, { duration: videoEl.value.duration })
}

function onVideoTimeupdate () {
  ipc.commit(types.VIDEO_TIMEUPDATE, { currentTime: videoEl.value.currentTime })
}

function onVideoPlay () {
  ipc.commit(types.VIDEO_PLAYED)
}

function onVideoPause () {
  ipc.commit(types.VIDEO_PAUSED)
}

function onVideoEnded () {
  ipc.commit(types.VIDEO_ENDED)
}

function onVideoLoadStart () {
  ipc.commit(types.VIDEO_PAUSED)
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

