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

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    videoSource(): string {
      if (!this.$store.state.video.source.path) {
        return '';
      }
      return 'file://' + this.$store.state.video.source.path;
    },
  },
  methods: {
    onVideoCanplay() {},
    onVideoTimeupdate() {},
    onVideoPlay() {},
    onVideoPause() {},
    onVideoEnded() {},
    onVideoLoadStart() {},
  },
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
