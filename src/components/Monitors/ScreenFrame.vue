<template>
  <div class="screen-frame" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="screen">
      <slot />
    </div>
    <ScreenHandle class="handle" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ScreenHandle from '../Monitors/ScreenHandle.vue';

export default Vue.extend({
  components: {
    ScreenHandle,
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

<style lang="postcss" scoped>
.screen-frame {
  width: 100%;
  height: 100%;
  .handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
.screen {
  position: relative;
  overflow: hidden;
}
</style>
