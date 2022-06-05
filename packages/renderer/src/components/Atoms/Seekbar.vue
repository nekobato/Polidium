<template>
  <div class="seekbar" ref="seekbar" @click="seek($event)">
    <div class="seekbar-inner" ref="seekbarInner" :style="`width: ${seekingParcent}`"></div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { State } from '@/store/state';
import { computed, ref } from 'vue';

const store = useStore();

const seekbarEl = ref<HTMLDivElement | null>(null);
const seekbarInnerEl = ref<HTMLDivElement | null>(null);

const media = store.state.video.media;

const seekingParcent = () => {
  return (media.duration ? (media.currentTime / media.duration) * 100 : 0) + '%';
};

const seek = (e: MouseEvent) => {
  const parcentage = e.offsetX / seekbarEl.value!.offsetWidth;
  store.commit('seekMedia', parcentage);
};
</script>

<style>
.seekbar {
  margin: 10px 0;
  width: 100%;
  height: 6px;
  background: #fff;
  border-radius: 3px;
}
</style>
