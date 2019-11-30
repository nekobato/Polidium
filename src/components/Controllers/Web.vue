<template>
  <div class="web-controller">
    <div class="buttons-container">
      <div class="buttons">
        <button class="button prev" @click="onClickPrevious">
          <PreviousIcon class="icon" />
        </button>
        <button class="button refresh" @click="onClickReload">
          <ReloadIcon class="icon" />
        </button>
        <button class="button next" @click="onClickNext">
          <NextIcon class="icon" />
        </button>
      </div>
    </div>
    <div class="url">
      <form @submit.prevent="onSubmitUrl">
        <textarea class="url-field" placeholder="https://..." v-model="url" />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '../../mutation-types';
import { mapMutations } from 'vuex';
import { webviewAction } from '../../values';
import PreviousIcon from '../Icons/Previous.vue';
import NextIcon from '../Icons/Next.vue';
import ReloadIcon from '../Icons/Reload.vue';

export default Vue.extend({
  name: 'Web',
  components: {
    PreviousIcon,
    NextIcon,
    ReloadIcon,
  },
  data() {
    return {
      url: '',
    };
  },
  computed: {
    web(): any {
      return this.$store.state.web;
    },
  },
  methods: {
    onSubmitUrl() {
      this.$store.commit(types.BROWSER_VIEW_EVENT, {
        action: types.SET_URL,
        url: this.url,
      });
    },
    onClickPrevious() {
      this.$store.commit(types.BROWSER_VIEW_EVENT, {
        action: types.BROWSER_BACK,
      });
    },
    onClickReload() {
      this.$store.commit(types.BROWSER_VIEW_EVENT, {
        action: types.BROWSER_RELOAD,
      });
    },
    onClickNext() {
      this.$store.commit(types.BROWSER_VIEW_EVENT, {
        action: types.BROWSER_FORWARD,
      });
    },
  },
});
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
        fill: hsl(0, 0%, 50%);
      }
    }
  }
  .icon {
    width: 16px;
    height: 16px;
    fill: hsl(0, 0%, 20%);
    transition: fill 0.16s;
    &:active {
      fill: hsl(0, 0%, 50%);
    }
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
    font-weight: bold;
    color: hsl(0, 0%, 30%);
    outline: 0;
    resize: none;
  }
}
</style>
