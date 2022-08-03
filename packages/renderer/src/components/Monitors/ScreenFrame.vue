<template>
  <div class="screen-frame" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="screen">
      <slot />
    </div>
    <ScreenHandle v-if="resizing" />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import ScreenHandle from '@/components/Monitors/ScreenHandle.vue';

const store = useStore();

const { resizing } = store;

const onMouseEnter = (): void => {
  store.commit('onMouseEnter');
};

const onMouseLeave = (): void => {
  store.commit('onMouseLeave');
};
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
  height: 100%;
  overflow: hidden;
}
</style>
