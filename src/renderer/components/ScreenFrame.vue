<template>
  <div class="screen-frame" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <Header class="header" />
    <div class="screen">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './Controllers/Header.vue';

export default Vue.extend({
  components: {
    Header,
  },
  data() {
    return this.$store.state.settings;
  },
  computed: {
    onMouse(): boolean {
      return this.$store.state.window.onMouse;
    },
    controllerView(): string {
      return this.$store.state.controllerView;
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
  grid-template-rows: 48px 1fr;
  width: 100%;
  height: 100%;
}
.screen {
  position: relative;
  border-radius: 4px;
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
</style>
