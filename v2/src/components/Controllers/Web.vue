<template>
  <div class="web-controller">
    <div class="button-container">
      <button class="button prev" @click="onClickBack">Prev</button>
      <button class="button next" @click="onClickForward">Next</button>
      <button class="button refresh" @click="onClickReload">Reload</button>
    </div>
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

export default Vue.extend({
  name: 'Web',
  components: {},
  data() {
    return {
      url: '',
    }
  },
  methods: {
    onSubmitUrl() {
      this.$store.commit('webSubmitUrl', {
        url: this.$data.url
      });
    },
    onClickBack() {
      this.$store.commit('webAction', {
        action: webviewAction.back
      });
    },
    onClickReload() {
      this.$store.commit('webAction', {
        action: webviewAction.reload
      });
    },
    onClickForward() {
      this.$store.commit('webAction', {
        action: webviewAction.forward
      });
    },
  }
});
</script>

<style scoped>
.web-controller {
  padding: 4px;
  width: 100%;
  height: 100%;
  background: #888;
}
.button-container {
  width: 148px;
  background: #ccc;
}
.button {
  padding: 0;
  width: 48px;
}
.url-container {
  display: block;
  padding: 8px;
}
.url {
  width: 100%;
}
</style>
