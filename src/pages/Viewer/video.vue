<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

const videoRef = ref<HTMLVideoElement>();

const state = reactive({
  src: '',
});

const onVideoCanplay = () => {
  window.ipc.send('viewer:video', { action: 'canplay' });
};
const onVideoTimeupdate = (event: Event) => {
  window.ipc.send('viewer:video', { action: 'timeupdate', currentTime: (event.target as HTMLVideoElement).currentTime });
};
const onVideoEnded = () => {
  window.ipc.send('viewer:video', { action: 'ended' });
};
const onVideoLoadStart = () => {
  window.ipc.send('viewer:video', { action: 'loadstart' });
};

onMounted(() => {
  window.ipc.on('viewer:video', (event: Event, data: any) => {
    if (!videoRef.value) {
      return;
    }
    switch (data.action) {
      case 'play':
        videoRef.value.play();
        break;
      case 'pause':
        videoRef.value.pause();
        break;
      case 'seek':
        videoRef.value.currentTime = data.currentTime;
        break;
      case 'set-src':
        state.src = data.src;
        break;
    }
  });
});
</script>
<template>
  <video
    class="video"
    ref="videoRef"
    :src="state.src"
    @canplay="onVideoCanplay"
    @timeupdate="onVideoTimeupdate"
    @ended="onVideoEnded"
    @loadstart="onVideoLoadStart"
  />
</template>
<style lang="scss" scoped>
.video {
  width: 100%;
  height: 100%;
}
</style>
