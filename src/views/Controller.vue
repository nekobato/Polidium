<template>
  <div class="controller">
    <div class="settings-container">
      <button class="settings">
        <Power class="icon" />
      </button>
      <ClickthroughSwitch :status="clichthrough" @toggle="toggleClickThrough" />
    </div>
    <Opacity />
    <ModeTab :mode="mode" @selectTab="switchTab" />
    <div class="mode-container">
      <Web v-show="mode === 'web'" />
      <Video v-show="mode === 'video'" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Opacity from '@/components/Controllers/Opacity.vue';
import ModeTab from '@/components/Controllers/ModeTab.vue';
import Web from '@/components/Controllers/Web.vue';
import Video from '@/components/Controllers/Video.vue';
import ClickthroughSwitch from '@/components/Controllers/ClickthroughSwitch.vue';
import Power from '@/components/Icons/Power.vue';
export default Vue.extend({
  components: {
    Opacity,
    ModeTab,
    Web,
    Video,
    Power,
    ClickthroughSwitch,
  },
  data() {
    return {
      mode: 'web',
      clichthrough: true,
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
    toggleClickThrough() {
      this.clichthrough = !this.clichthrough;
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
  background: hsla(0, 0%, 100%, 0.8);
  border: 1px solid #ccc;
  .settings-container {
    position: relative;
    height: 32px;
    padding: 4px 0;
  }
  .settings {
    position: absolute;
    left: 4px;
    top: 4px;
    width: 32px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 12px;
    cursor: pointer;
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
}
</style>
