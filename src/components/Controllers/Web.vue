<template>
  <div class="web-controller">
    <button class="button prev" @click="onClickPrevious"><PreviousIcon class="icon"/></button>
    <button class="button next" @click="onClickNext"><NextIcon class="icon"/></button>
    <button class="button refresh" @click="onClickReload"><ReloadIcon class="icon"/></button>
    <div class="url-container">
      <form @submit.prevent="onSubmitUrl">
        <input class="url" type="url" v-model="url" />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapMutations } from 'vuex';
import { webviewAction } from '../../values';
import PreviousIcon from '@/components/Icons/Previous.vue';
import NextIcon from '@/components/Icons/Next.vue';
import ReloadIcon from '@/components/Icons/Reload.vue';

export default Vue.extend({
  name: 'Web',
  components: {
    PreviousIcon,
    NextIcon,
    ReloadIcon
  },
  data() {
    return {
      url: '',
    }
  },
  computed: {
    storeUrl(): string {
      return this.$store.state.web.url;
    }
  },
  methods: {
    onSubmitUrl() {
      this.$store.commit('webSubmitUrl', {
        url: this.$data.url
      });
    },
    onClickPrevious() {
      this.$store.commit('webAction', {
        action: webviewAction.back
      });
    },
    onClickReload() {
      this.$store.commit('webAction', {
        action: webviewAction.reload
      });
    },
    onClickNext() {
      this.$store.commit('webAction', {
        action: webviewAction.forward
      });
    },
  },
  watch: {
    storeUrl(url) {
      this.$data.url = url;
    }
  }
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
  padding: 0;
  width: 32px;
  border: none;
  background: transparent;
}
.icon {
  width: 20px;
  height: 20px;
  fill: hsla(0, 0, 100%, 1);
}
.url-container {
  display: block;
  padding: 2px 8px;
}
.url {
  padding: 1px 4px;
  width: 100%;
  line-height: 16px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
}
</style>
