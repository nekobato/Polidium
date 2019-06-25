<template>
  <div class="video-controller">
    <button class="button play">
      <PlayIcon class="icon" />
    </button>
    <div class="seekbar-container">
      <Seekbar />
    </div>
    <button class="button list" @click="toggleList">
      <ListIcon class="icon" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { webviewAction } from '../../values';
import * as types from '../../../shared/mutation-types';
import PlayIcon from '../Icons/Play.vue';
import PauseIcon from '../Icons/Pause.vue';
import ListIcon from '../Icons/List.vue';
import Seekbar from '../Atoms/Seekbar.vue';

export default Vue.extend({
  name: 'Web',
  components: {
    PlayIcon,
    PauseIcon,
    ListIcon,
    Seekbar,
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

<style lang="scss" scoped>
.video-controller {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  padding: 0 4px;
  width: 100%;
  height: 100%;
  background: #888;
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
