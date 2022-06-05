<template>
  <li class="item" @click="onClick">
    <span class="index">{{ index + 1 }}</span>
    <span class="file-name">{{ title }}</span>
  </li>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import * as types from '../../../../mutation-types';

const store = useStore();

const props = defineProps(['title', 'index']);

const onClick = () => {
  store.commit(types.VIDEO_SELECT_FILE, props.index);
};
</script>

<style lang="postcss" scoped>
.item {
  display: flex;
  align-items: center;
  padding: 0 4px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
.index {
  display: inline-block;
  width: 24px;
  font-size: 12px;
  line-height: 24px;
  font-weight: bold;
  text-align: right;
}
.file-name {
  margin-left: 8px;
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
}
</style>
