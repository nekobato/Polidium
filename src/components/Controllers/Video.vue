<template>
  <div class="web-controller">
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
    }
  },
  methods: {
  }
});
</script>

<style scoped>
.video-controller {
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
