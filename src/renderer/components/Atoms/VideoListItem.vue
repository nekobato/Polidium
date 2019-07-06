<template>
  <li class="item" @click="onClick">
    <span class="index">{{ index + 1 }}</span>
    <span class="file-name">{{ title }}</span>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '../../../shared/mutation-types';

export default Vue.extend({
  props: ['title', 'index'],
  methods: {
    onClick() {
      this.$store.commit(types.VIDEO_SELECT_FILE, this.index);
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  padding: 0 8px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
.index {
  font-size: 16px;
  line-height: 24px;
}
.file-name {
  margin-left: 8px;
  font-size: 16px;
  line-height: 24px;
  text-overflow: ellipsis;
}
</style>
