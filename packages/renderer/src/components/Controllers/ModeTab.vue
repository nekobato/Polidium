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
<style lang="postcss" scoped>
.mode-tab {
  --height: 32px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: var(--height);
  .item {
    padding: 4px 0;
    width: 40%;
    height: 24px;
    font-size: 16px;
    line-height: 16px;
    border: 1px solid rgba(0, 0, 0, 0.32);
    border-radius: 12px;
    cursor: pointer;
    &.on {
      background: #eee;
    }
  }
}
</style>
