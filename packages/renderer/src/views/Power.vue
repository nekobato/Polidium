<template>
  <div class="controller nn-glass-box">
    <button class="power"><Icon icon="mdi:power" class="nn-icon size-xsmall" /></button>
    <ModeTab :mode="mode" @selectTab="switchTab" />
    <button class="settings">
      <Icon icon="mdi:settings" class="nn-icon size-xsmall" />
    </button>
    <div class="mode-container">
      <Web v-show="mode === 'web'" />
      <Video v-show="mode === 'video'" />
    </div>
    <Opacity classs="opacity" />
  </div>
</template>
<script lang="ts" setup>
import Opacity from '@/components/Controllers/Opacity.vue';
import ModeTab from '@/components/Controllers/ModeTab.vue';
import Web from '@/components/Controllers/Web.vue';
import Video from '@/components/Controllers/Video.vue';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const mode = ref('web');
const clichthrough = ref(true);

const switchTab = (name: string) => {
  if (name === mode.value) return;
  switch (name) {
    case 'web':
      mode.value = 'web';
      break;
    case 'video':
      mode.value = 'video';
  }
};
const toggleClickThrough = () => {
  clichthrough.value = !clichthrough.value;
};
</script>
<style lang="postcss">
:root {
  --window-width: 320px;
  --window-height: 400px;
}
</style>
<style lang="postcss" scoped>
.controller {
  padding-top: 8px;
  position: relative;
  width: var(--window-width);
  height: var(--window-height);
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.6);
  .settings-container {
    position: relative;
    height: 32px;
    padding: 4px 0;
  }
  .power,
  .settings {
    position: absolute;
    top: 14px;
    width: 32px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 12px;
    cursor: pointer;
  }
  .power {
    left: 8px;
  }
  .settings {
    right: 8px;
  }
  .icon {
    width: 12px;
    height: 12px;
    fill: hsl(0, 0%, 20%);
    transition: fill 0.16s;
    &:hover {
      fill: hsl(0, 0%, 50%);
    }
  }
  .mode-container {
    flex: 1 1 auto;
  }
  .opacity {
    margin: auto 0 2px;
  }
}
</style>
