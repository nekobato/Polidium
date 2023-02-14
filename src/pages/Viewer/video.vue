<script lang="ts">
const ipc = require("renderer/ipc");
const types = require("root/mutation-types");

module.exports = {
  name: "video-player",
  watch: {
    ["video.seekPercentage"](value) {
      this.$refs["video"].currentTime = (this.video.duration / 100) * value;
    },
    ["video.switch"](value) {
      if (value === true) {
        this.$refs["video"].play();
      } else {
        this.$refs["video"].pause();
      }
    },
  },
  computed: {
    queues() {
      return this.$store.state.video.queues;
    },
    playPointer() {
      return this.$store.state.video.playPointer;
    },
    videoSource() {
      return this.queues[this.playPointer]
        ? this.queues[this.playPointer].path
        : "";
    },
    video() {
      return this.$store.state.video.video;
    },
  },
  methods: {
    onVideoCanplay() {
      ipc.commit(types.VIDEO_CANPLAY, {
        duration: this.$refs["video"].duration,
      });
    },
    onVideoTimeupdate() {
      ipc.commit(types.VIDEO_TIMEUPDATE, {
        currentTime: this.$refs["video"].currentTime,
      });
    },
    onVideoPlay() {
      ipc.commit(types.VIDEO_PLAYED);
    },
    onVideoPause() {
      ipc.commit(types.VIDEO_PAUSED);
    },
    onVideoEnded() {
      ipc.commit(types.VIDEO_ENDED);
    },
    onVideoLoadStart() {
      ipc.commit(types.VIDEO_PAUSED);
    },
  },
};
</script>
<template>
  <video
    class="video"
    ref="video"
    v-bind="{ src: videoSource }"
    @canplay="onVideoCanplay"
    @timeupdate="onVideoTimeupdate"
    @play="onVideoPlay"
    @pause="onVideoPause"
    @ended="onVideoEnded"
    @loadstart="onVideoLoadStart"
  />
</template>
<style lang="scss" scoped>
.video {
  margin: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
