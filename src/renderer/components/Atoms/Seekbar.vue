<template>
  <div class="seekbar" :ref="seekbar" @click="seek">
    <div class="seekbar-inner" :style="{ width: seekingParcent }"></div>
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    seekingParcent: {
      cache: false,
      get: function() {
        if (!this.$refs.audio) {
          return '0%';
        }
        return (this.control.currentTime / this.$refs.audio.duration) * 100 + '%';
      },
    },
  },
  methods: {
    seekBarStyle() {
      const media = this.$store.state.video.media;
      return {
        width: (!!media.duration ? (media.currentTime / media.duration) * 100 : 0) + '%',
      };
    },
    seek(e) {
      const parcentage = e.offsetX / this.$refs.seekbar.offsetWidth;
      this.$refs.audio.currentTime = this.$refs.audio.duration * parcentage;
    },
  },
};
</script>

<style>
.seekbar {
  margin: 9px 0;
  width: 100%;
  height: 6px;
  background: #fff;
  border-radius: 3px;
}
</style>
