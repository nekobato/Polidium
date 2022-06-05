<template>
  <div class="container">
    <div class="header-top">
      <component :is="mode" />
    </div>
    <div class="header-bottom">
      <button class="btn mode web" :class="{ active: mode === 'Web' }" @click="onWebClicked">
        <WebIcon class="icon web" />
      </button>
      <button class="btn mode video" :class="{ active: mode === 'Video' }" @click="onVideoClicked">
        <VideoIcon class="icon video" />
      </button>
      <div class="grabbing-area"></div>
      <div class="opacity-container">
        <Opacity />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Vue, { computed, reactive } from 'vue';
import Opacity from '../Atoms/Opacity.vue';
import WebIcon from '../Icons/Web.vue';
import VideoIcon from '../Icons/Video.vue';
import Web from '../Controllers/Web.vue';
import Video from '../Controllers/Video.vue';
import { useStore } from '@/store';

const store = useStore();

const data = reactive({
  opacity: 1,
});

const mode = computed(() => {
  return store.state.mode;
});

const onClickOpenSettings = (): void => {
  store.commit('openSettings');
};
const onClickCloseSettings = (): void => {
  store.commit('closeSettings');
};
const onVideoClicked = (): void => {
  store.commit('changeModeToVideo');
};
const onWebClicked = (): void => {
  store.commit('changeModeToWeb');
};
const onListClicked = (): void => {
  store.commit('toggleController');
};
</script>

<style lang="postcss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
}
.header-top,
.header-bottom {
  position: relative;
  display: grid;
}
.header-bottom {
  grid-template-columns: 64px 64px 1fr 160px;
  height: 22px;
  .btn {
    padding: 0;
    width: 64px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    &:hover {
      background: #ddd;
    }
    &.active {
      .icon {
        fill: #ddd;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      fill: #444;
    }
  }
  .opacity-container {
    margin: 0 16px 0 0;
    width: 160px;
    height: 100%;
  }
}
.grabbing-area {
  -webkit-app-region: drag;
  cursor: grab;
}
.header-top {
  height: 26px;
  -webkit-app-region: no-drag;
}
</style>
