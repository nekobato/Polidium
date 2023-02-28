<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { NSpace } from 'naive-ui';

const finishResizeMode = () => {};
</script>
<template>
  <NSpace>
    <NButton @click="finishResizeMode">
      <template #icon>
        <Icon icon="ic:round-done" />
      </template>
    </NButton>
  </NSpace>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: red;
}
</style>
