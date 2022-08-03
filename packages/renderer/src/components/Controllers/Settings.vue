<template>
  <div class="settings nn-glass-box">
    <div class="header">
      <button class="power-button"><Icon icon="mdi:power" class="nn-icon size-xsmall" /></button>
      <button class="settings-button" @click="close">
        <Icon icon="mdi:settings" class="nn-icon size-xsmall" />
      </button>
    </div>
    <button class="nn-button type-secondary mt-16" @click="toggleResize()">画面サイズ変更</button>
    <button class="nn-button type-secondary mt-16" @click="close()">終了</button>
  </div>
</template>
<script lang="ts" setup>
import store from '@/store';
import * as types from '@/../../mutation-types';
import { Icon } from '@iconify/vue';

const toggleResize = () => {
  store.commit(types.TOGGLE_RESIZE);
};

const close = () => {
  store.commit(types.TOGGLE_SETTINGS);
};
</script>
<style lang="postcss" scoped>
.settings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 0 16px;
  .header {
    display: flex;
    width: 100%;
    height: 48px;
    .power-button,
    .settings-button {
      position: absolute;
      top: 14px;
      width: 32px;
      height: 20px;
      border: 1px solid #ddd;
      border-radius: 12px;
      cursor: pointer;
    }
    .power-button {
      left: 8px;
    }
    .settings-button {
      right: 8px;
    }
  }
}
</style>
