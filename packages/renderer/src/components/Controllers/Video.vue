<template>
  <div class="video-controller">
    <VideoList />
  </div>
</template>

<script lang="ts" setup>
import * as types from '@/../../mutation-types';
import VideoList from './VideoList.vue';
import { useStore } from '@/store';

const store = useStore();

const toggleList = () => {
  const now = store.state.video.fileList.isVisible;
  store.commit(types.VIDEO_LIST_TOGGLE, !now);
};
</script>

<style lang="postcss" scoped>
.video-controller {
  padding: 0 4px;
  width: 100%;
  height: 100%;
  .video-list {
    margin: 8px 0;
    width: 100%;
    height: 200px;
  }
}
.seekbar-container {
  padding: 0 8px;
  width: 100%;
}
.button {
  width: 26px;
  height: 26px;
  > .icon {
    width: 100%;
    height: 100%;
    fill: hsla(0, 0, 0, 1);
  }
}
</style>
