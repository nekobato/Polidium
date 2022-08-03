<template>
  <ScreenFrame>
    <router-view></router-view>
  </ScreenFrame>
</template>
<script lang="ts" setup>
import ScreenFrame from '@/components/Monitors/ScreenFrame.vue';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useStore();
</script>
<style lang="postcss" scoped>
.mode {
  width: 100%;
  height: 100%;
}
</style>
