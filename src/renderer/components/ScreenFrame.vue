<template>
  <div class="screen-frame" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="screen">
      <slot />
    </div>
    <div class="header-container">
      <Header class="header" v-show="onMouse || true" />
    </div>
    <VideoList class="video-list" v-show="videoFileList.isVisible" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './Controllers/Header.vue';
import VideoList from './Controllers/VideoList.vue';

export default Vue.extend({
  components: {
    Header,
    VideoList,
  },
  data() {
    return {
      settings: this.$store.state.settings,
    };
  },
  computed: {
    onMouse(): boolean {
      return this.$store.state.window.onMouse;
    },
    controllerView(): string {
      return this.$store.state.controllerView;
    },
    videoFileList(): boolean {
      return this.$store.state.video.fileList;
    },
  },
  methods: {
    onMouseEnter(): void {
      this.$store.commit('onMouseEnter');
    },
    onMouseLeave(): void {
      this.$store.commit('onMouseLeave');
    },
  },
});
</script>

<style scoped>
.screen-frame {
  display: grid;
  grid-template-rows: 1fr 48px;
  width: 100%;
  height: 100%;
}
.screen {
  position: relative;
  overflow: hidden;
}
.header {
  height: 48px;
  background: #ccc;
  overflow: hidden;
}
.controllers-container {
  position: absolute;
  top: 48px;
  left: 0;
  width: 320px;
  height: 160px;
  background: transparent;
}
.video-list {
  position: absolute;
  top: 0;
  bottom: 48px;
  right: 0;
  width: 320px;
  height: auto;
}
</style>
