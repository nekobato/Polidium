<template>
  <div class="video-controller">
    <div class="buttons-container">
      <div class="buttons">
        <button
          class="button prev"
          :class="{ disable: !video.canGoBack }"
          @click="onClickPrevious"
          :disabled="!video.canGoForward"
        >
          <PreviousIcon class="icon" />
        </button>
        <button class="button refresh" @click="onClickPlayOrPause">
          <PauseIcon class="icon" v-if="video.media.isPlaying" />
          <PlayIcon class="icon" v-else />
        </button>
        <button
          class="button next"
          :class="{ disable: !video.canGoForward }"
          @click="onClickNext"
          :disabled="!video.canGoForward"
        >
          <NextIcon class="icon" />
        </button>
      </div>
    </div>
    <VideoList />
  </div>
</template>

<script lang="ts" setup>
import * as types from '@/../../mutation-types';
import VideoList from './VideoList.vue';
import PreviousIcon from '../Icons/Previous.vue';
import NextIcon from '../Icons/Next.vue';
import PlayIcon from '../Icons/Play.vue';
import PauseIcon from '../Icons/Pause.vue';
import { useStore } from '@/store';

const store = useStore();

const { video } = store.state;

const onClickPrevious = () => {
  store.commit(types.VIDEO_BACK);
};
const onClickPlayOrPause = () => {
  const event = video.media.isPlaying ? types.VIDEO_PAUSE : types.VIDEO_PLAY;
  store.commit(event);
};
const onClickNext = () => {
  store.commit(types.VIDEO_FORWARD);
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

.buttons-container {
  padding: 16px 0;

  .buttons {
    display: flex;
    margin: 0 auto;
    padding: 0 4px;
    width: 160px;
    border: 1px solid #ddd;
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.8);
    overflow: hidden;
  }
  .button {
    padding: 8px 0;
    flex-grow: 1;
    &:hover {
      .icon {
        fill: hsl(0, 0%, 60%);
      }
    }
    &.disable {
      .icon {
        fill: hsl(0, 0%, 80%);
      }
    }
  }
  .icon {
    width: 16px;
    height: 16px;
    fill: hsl(0, 0%, 40%);
    transition: fill 0.16s;
  }
}
</style>
