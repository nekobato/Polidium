<template>
  <div class="handle"></div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';

const store = useStore();
const settings = store.state.settings;

const onMouseEnter = (): void => {
  store.commit('onMouseEnter');
};

const onMouseLeave = (): void => {
  store.commit('onMouseLeave');
};
</script>

<style scoped>
.handle {
  width: 240px;
  height: 16px;
  background: hsla(0, 0%, 100%, 0.6);
  border-radius: 0 0 60% 60%;
  cursor: grab;
  -webkit-app-region: drag;
}
</style>
