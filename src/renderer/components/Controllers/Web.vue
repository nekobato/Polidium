<template>
  <div class="web-controller">
    <button class="button prev" @click="onClickPrevious">
      <PreviousIcon class="icon" />
    </button>
    <button class="button next" @click="onClickNext">
      <NextIcon class="icon" />
    </button>
    <button class="button refresh" @click="onClickReload">
      <ReloadIcon class="icon" />
    </button>
    <div class="url-container">
      <form @submit.prevent="onSubmitUrl">
        <input class="url" type="url" v-model="url" />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '../../../shared/mutation-types';
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
  watch: {
    ['web.url'](url: string) {
      this.url = url;
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

<style lang="scss" scoped>
$button-width: 32px;

.web-controller {
  display: grid;
  grid-template-columns: $button-width $button-width $button-width 1fr;
  width: 100%;
  height: 100%;
  background: #888;
}
.button {
  padding: 3px;
  width: 32px;
}
.icon {
  width: 20px;
  height: 20px;
  fill: hsla(0, 0, 100%, 1);
  filter: url(#drop-shadow);
  transition: fill 0.16s;
  &:hover {
    fill: hsla(0, 0, 90%, 1);
  }
  &:active {
    fill: hsla(0, 0, 80%, 1);
  }
}
.url-container {
  display: block;
  padding: 5px 8px;
}
.url {
  padding: 1px 8px;
  width: 100%;
  line-height: 16px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: bold;
  color: hsla(0, 0, 50%, 1);
}
</style>
