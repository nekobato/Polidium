<template>
  <div class="controller">
    <Opacity />
    <ModeTab @selectTab="switchTab" />
    <div class="mode-container">
      <Web v-show="mode === 'web'" />
      <Video v-show="mode === 'video'" />
    </div>
    <button class="settings"><Power class="icon" /></button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Opacity from '@/components/Controllers/Opacity.vue';
import ModeTab from '@/components/Controllers/ModeTab.vue';
import Web from '@/components/Controllers/Web.vue';
import Video from '@/components/Controllers/Video.vue';
import Power from '@/components/Icons/Power.vue';
export default Vue.extend({
  components: {
    Opacity,
    ModeTab,
    Web,
    Video,
    Power,
  },
  data() {
    return {
      mode: 'web',
    };
  },
  methods: {
    switchTab(name: string) {
      switch (name) {
        case 'web':
          this.mode = 'web';
          break;
        case 'video':
          this.mode = 'video';
      }
    },
  },
});
</script>
<style lang="postcss">
:root {
  --window-width: 240px;
  --window-height: 320px;
}
</style>
<style lang="postcss" scoped>
.controller {
  position: relative;
  width: var(--window-width);
  height: var(--window-height);
  border: 1px solid #ccc;
  .settings {
    position: absolute;
    right: 4px;
    bottom: 0;
    padding: 0 16px;
    border: 1px solid #ddd;
  }
  .icon {
    width: 16px;
    height: 16px;
    fill: hsl(0, 0%, 20%);
    transition: fill 0.16s;

    &:hover {
      fill: hsl(0, 0%, 50%);
    }
  }
}
</style>
