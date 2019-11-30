<template>
  <li class="item" @click="onClick">
    <span class="index">{{ index + 1 }}</span>
    <span class="file-name">{{ title }}</span>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '../../mutation-types';

export default Vue.extend({
  props: ['title', 'index'],
  methods: {
    onClick() {
      this.$store.commit(types.VIDEO_SELECT_FILE, this.index);
    },
  },
});
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
