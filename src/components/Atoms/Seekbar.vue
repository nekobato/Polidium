<template>
  <div class="seekbar" ref="seekbar" @click="onClickSeekbar">
    <div class="seekbar-inner" :style="seekInnerStyle"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    media(): any {
      return this.$store.state.video.media;
    },
    seekInnerStyle(): any {
      return {
        width: !!this.media.duration
          ? (this.media.currentTime / this.media.duration) * 100
          : 0 + '%',
      };
    },
  },
  methods: {
    onClickSeekbar: function(e: MouseEvent) {
      const seekbarElement = this.$refs.seekbar as HTMLElement;
      const parcentage = e.offsetX / seekbarElement.offsetWidth;
      this.$store.commit('videoSeek', this.media.duration * parcentage);
    },
  },
});
</script>

<style lang="scss" scoped>
.seekbar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.seekbar-inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: hsla(0, 60%, 50%, 1);
  border-radius: 4px;
  transition: width 0.1s ease 0s;
}
</style>
