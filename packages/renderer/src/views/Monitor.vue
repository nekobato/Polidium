<template>
  <ScreenFrame>
    <component :is="mode" class="mode" />
  </ScreenFrame>
</template>
<script lang="ts" setup>
import Vue from 'vue';
import ScreenFrame from '@/components/Monitors/ScreenFrame.vue';
import Video from '@/components/Monitors/Video.vue';
import Web from '@/components/Monitors/Web.vue';
import { useStore } from '@/store';

const store = useStore();

const mode = store.state.mode;
</script>
<style lang="postcss" scoped>
.mode {
  width: 100%;
  height: 100%;
}
</style>
