<template>
  <div class="handle"></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  components: {},
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
.handle {
  width: 240px;
  height: 16px;
  background: hsla(0, 0%, 100%, 0.6);
  border-radius: 0 0 60% 60%;
  cursor: grab;
}
</style>
