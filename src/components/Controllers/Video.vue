<template>
  <div class="video-controller">
    <VideoList />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { webviewAction } from '../../values';
import * as types from '../../mutation-types';
import VideoList from './VideoList.vue';

export default Vue.extend({
  name: 'Web',
  components: {
    VideoList,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    toggleList() {
      const now = this.$store.state.video.fileList.isVisible;
      this.$store.commit(types.VIDEO_LIST_TOGGLE, !now);
    },
  },
});
</script>

<style lang="postcss" scoped>
.video-controller {
  padding: 0 4px;
  width: 100%;
  height: 100%;
  .video-list {
    margin: 8px 0;
    width: 100%;
    height: 210px;
  }
}
.seekbar-container {
  padding: 0 8px;
  width: 100%;
}
.button {
  width: 26px;
  height: 26px;
  > .icon {
    width: 100%;
    height: 100%;
    fill: hsla(0, 0, 0, 1);
  }
}
</style>
