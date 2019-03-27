<template>
  <div class="screen-frame" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="screen-controller-container">
      <Header class="screen-controller"/>
    </div>
    <div class="screen">
      <slot/>
      <div class="screen-border" v-show="onMouse"/>
    </div>
    <div class="controllers-container">
      <component :is="controllerView"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "./Controllers/Header.vue";
import Settings from "./Controllers/Settings.vue";

export default Vue.extend({
  components: {
    Settings,
    Header
  },
  computed: {
    onMouse(): boolean {
      return this.$store.state.window.onMouse;
    },
    controllerView(): string {
      return this.$store.state.controllerView;
    }
  },
  methods: {
    onMouseEnter(): void {
      this.$store.commit("onMouseEnter");
    },
    onMouseLeave(): void {
      this.$store.commit("onMouseLeave");
    }
  }
});
</script>

<style scoped>
.screen-frame {
  display: grid;
  grid-template-rows: 32px 1fr;
  width: 100%;
  height: 100%;
}

.screen {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.screen-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(0, 0, 0, 0.24);
}
.screen-controller-container {
}
.screen-controller {
  height: 32px;
  background: #ccc;
  overflow: hidden;
  -webkit-app-region: drag;
  cursor: grab;
}
.controllers-container {
  position: absolute;
  top: 32px;
  left: 0;
  width: 320px;
  height: 160px;
  background: transparent;
}
</style>
