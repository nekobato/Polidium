<template>
  <div class="controller">
    <div class="settings-container">
      <button class="settings"><Power class="icon" /></button>
      <div
        class="clickthrough-toggle"
        :class="{
          on: clichthrough,
          off: !clichthrough,
        }"
        @click="toggleClickThrough"
      >
        <span class="label">CLICKTHROUGH</span>
        <div class="switch" />
      </div>
    </div>
    <Opacity />
    <ModeTab @selectTab="switchTab" />
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
    .settings {
      position: absolute;
      left: 4px;
      top: 4px;
      padding: 0 8px;
      height: 20px;
      border: 1px solid #ddd;
      border-radius: 12px;
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
    .clickthrough-toggle {
      --toggle-height: 20px;
      position: relative;
      margin: auto;
      width: 100px;
      height: var(--toggle-height);
      background: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 12px;
      cursor: pointer;
      &.on {
        .switch {
          left: 39px;
        }
      }
      &.off {
        .switch {
          left: 1px;
        }
      }
      .label {
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        height: 100%;
        text-align: center;
        font-size: 10px;
        line-height: var(--toggle-height);
        font-weight: bold;
        color: hsla(0, 0%, 0%, 0.5);
      }
      .switch {
        position: absolute;
        margin: auto;
        top: 1px;
        width: 60px;
        height: calc(var(--toggle-height) - 4px);
        border-radius: 16px;
        background: hsla(0, 0%, 100%, 0.7);
        box-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.16);
        transition: all 0.2s cubic-bezier(0.2, 0.68, 0, 1);
      }
    }
  }
}
</style>
