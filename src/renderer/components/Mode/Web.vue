<template>
  <div class="container">
    <webview class="webview" :src="webURL" ref="webview" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { webviewAction } from '../../values';

type Webview = Element & {
  canGoBack: () => boolean;
  goBack: () => void;
  canGoForward: () => boolean;
  goForward: () => void;
  reload: () => void;
};

export default Vue.extend({
  data: () => ({
    controller: {
      show: true,
    },
  }),
  computed: {
    webviewElement(): any {
      return this.$refs.webview;
    },
    webURL(): string {
      return this.$store.state.web.url;
    },
    action(): string {
      return this.$store.state.web.action;
    },
  },
  methods: {
    setUrl(e: any) {
      if (e.isMainFrame) {
        this.$store.commit('webSubmitUrl', { url: e.url });
      }
    },
  },
  watch: {
    action(action) {
      if (action === '') {
        return;
      }

      const webview = this.$refs.webview as Webview;
      switch (action) {
        case webviewAction.back:
          if (webview.canGoBack()) {
            webview.goBack();
          }
          break;
        case webviewAction.forward:
          if (webview.canGoForward()) {
            webview.goForward();
          }
          break;
        case webviewAction.reload:
          webview.reload();
          break;
      }

      this.$store.commit('endWebAction');
    },
  },
  mounted() {
    this.webviewElement.addEventListener('load-commit', this.setUrl);
  },
});
</script>

<style scoped>
.container,
.webview {
  width: 100%;
  height: 100%;
  background: #fff;
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
