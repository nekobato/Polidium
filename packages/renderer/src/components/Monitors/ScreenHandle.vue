<template>
  <div class="handle">
    <div class="content">
      <button class="nn-button" @click="fullscreen">
        <Icon icon="ic:round-fullscreen" color="#000" class="nn-icon size-32" />
        サイズを画面に合わせる
      </button>
      <button class="nn-button" @click="finish">
        <Icon icon="ic:round-check" color="#000" class="nn-icon size-32" />
        <span>完了</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { Icon } from '@iconify/vue';
import * as types from '@/../../mutation-types';

const store = useStore();

const fullscreen = (): void => {
  store.commit(types.SET_FULLSCREEN);
};

const finish = (): void => {
  store.commit(types.TOGGLE_RESIZE);
};
</script>

<style scoped>
.handle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: hsla(0, 0%, 100%, 0.8);
  cursor: grab;
  -webkit-app-region: drag;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  display: flex;
  gap: 32px;
}
</style>
