<template>
  <div class="web-controller">
    <div class="buttons-container">
      <div class="buttons">
        <button
          class="button prev"
          :class="{ disable: !web.canGoBack }"
          @click="onClickPrevious"
          :disabled="!web.canGoForward"
        >
          <PreviousIcon class="icon" />
        </button>
        <button class="button refresh" @click="onClickReload">
          <ReloadIcon class="icon" />
        </button>
        <button
          class="button next"
          :class="{ disable: !web.canGoForward }"
          @click="onClickNext"
          :disabled="!web.canGoForward"
        >
          <NextIcon class="icon" />
        </button>
      </div>
    </div>
    <div class="url">
      <form @submit.prevent="submitUrl" @keydown.prevent.enter="submitUrl">
        <textarea class="url-field" placeholder="https://..." v-model="url" />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import * as types from '@/../../mutation-types';
import PreviousIcon from '../Icons/Previous.vue';
import NextIcon from '../Icons/Next.vue';
import ReloadIcon from '../Icons/Reload.vue';
import { useStore } from '@/store';

const store = useStore();

const { web } = store.state;

const url = ref('');

const submitUrl = () => {
  store.commit(types.SET_URL, { url });
};

const onClickPrevious = () => {
  store.commit(types.BROWSER_VIEW_EVENT, {
    action: types.BROWSER_BACK,
  });
};
const onClickReload = () => {
  store.commit(types.BROWSER_VIEW_EVENT, {
    action: types.BROWSER_RELOAD,
  });
};
const onClickNext = () => {
  store.commit(types.BROWSER_VIEW_EVENT, {
    action: types.BROWSER_FORWARD,
  });
};

watch(
  () => web.url,
  () => {
    url.value = web.url;
  }
);
</script>

<style lang="postcss" scoped>
.web-controller {
  --window-width: 240px;
  --button-width: 32px;
  width: 100%;
  height: 100%;
  .buttons-container {
    padding: 16px 0;
  }
  .buttons {
    display: flex;
    margin: 0 auto;
    padding: 0 4px;
    width: 160px;
    border: 1px solid #ddd;
    border-radius: 32px;
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
  .url {
    display: block;
    padding: 0 4px;
  }
  .url-field {
    padding: 8px;
    width: 100%;
    height: 120px;
    border: 1px solid #ddd;
    border-radius: 16px;
    font-size: 12px;
    line-height: 18px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
    color: hsl(0, 0%, 40%);
    outline: 0;
    resize: none;
    word-break: break-all;
  }
}
</style>
