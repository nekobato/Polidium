<template>
  <div class="container">
    <webview class="webview" :src="webURL" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    controller: {
      show: true
    }
  }),
  computed: {
    webURL: () => {
      return 'https://google.com'
    }
  }
});
</script>

<style scoped>
.container,
.webview {
  width: 100%;
  height: 100%;
  background: transparent;
}

.web-controller {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
}
</style>
