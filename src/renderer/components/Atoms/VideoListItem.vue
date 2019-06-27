<template>
  <li class="item">
    <span class="index">{{ index + 1 }}</span>
    <span class="file-name">{{ title }}</span>
  </li>
</template>

<script lang="ts">
export default {
  props: ['title', 'index'],
  computed: {},
};
</script>

<style lang="scss" scoped>
.item {
  padding: 0 8px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
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
