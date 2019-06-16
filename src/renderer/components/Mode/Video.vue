<template>
  <div class="video">
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
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    videoSource(): string {
      return this.$store.state.video.source;
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
.video {
  height: 100%;
  background: #000;
}
</style>
