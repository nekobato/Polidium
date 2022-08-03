<template>
  <div class="mode-tab">
    <div class="item" :class="{ on: mode === 'web' }" @click="selectTab('web')">WEB</div>
    <div class="item" :class="{ on: mode === 'video' }" @click="selectTab('video')">VIDEO</div>
  </div>
</template>
<script lang="ts" setup>
import * as types from '@/../../mutation-types';
import { useStore } from '@/store';

const store = useStore();
const emit = defineEmits(['selectTab']);
const { mode } = defineProps(['mode']);

const selectTab = (name: string) => {
  emit('selectTab', name);
  store.commit(types.SET_MODE, name);
};
</script>
<style lang="scss" scoped>
$height: 32px;
.mode-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  height: $height;
  .item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100%;
    font-size: 16px;
    line-height: 16px;
    border: 1px solid rgba(0, 0, 0, 0.32);
    border-radius: calc($height / 2);
    cursor: pointer;
    &.on {
      background: #eee;
    }
    &:first-of-type {
      border-radius: calc($height / 2) 0 0 calc($height / 2);
      border-width: 1px 0 1px 1px;
    }
    &:last-of-type {
      border-radius: 0 calc($height / 2) calc($height / 2) 0;
      border-width: 1px 1px 1px 0;
    }
  }
}
</style>
