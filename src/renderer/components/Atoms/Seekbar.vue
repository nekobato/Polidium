<template>
  <div class="seekbar" ref="seekbar" @click="seek($event)">
    <div class="seekbar-inner" ref="seekbarInner" :style="{ width: seekingParcent }"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from '../../store';

export default Vue.extend({
  computed: {
    media(): State['video']['media'] {
      return this.$store.state.video.media;
    },
    seekbarEl(): HTMLDivElement {
      return this.$refs.seekbar as HTMLDivElement;
    },
    seekbarInnerEl(): HTMLDivElement {
      return this.$refs.seekbarInner as HTMLDivElement;
    },
    seekingParcent: {
      cache: false,
      get: function(): string {
        return (
          (this.media.duration ? (this.media.currentTime / this.media.duration) * 100 : 0) + '%'
        );
      },
    },
  },
  methods: {
    seekBarStyle() {
      return {
        width:
          (!!this.media.duration ? (this.media.currentTime / this.media.duration) * 100 : 0) + '%',
      };
    },
    seek(e: MouseEvent) {
      console.log(e.offsetX, this.seekbarEl.offsetWidth);
      const parcentage = e.offsetX / this.seekbarEl.offsetWidth;
      this.$store.commit('seekMedia', parcentage);
    },
  },
});
</script>

<style>
.seekbar {
  margin: 10px 0;
  width: 100%;
  height: 6px;
  background: #fff;
  border-radius: 3px;
}
</style>
