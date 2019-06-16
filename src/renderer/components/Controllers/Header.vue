<template>
  <div class="container">
    <div class="header-top">
      <button class="btn mode web" :class="{ active: mode === 'Web' }" @click="onWebClicked">
        <WebIcon class="icon web" />
      </button>
      <button class="btn mode video" :class="{ active: mode === 'Video' }" @click="onVideoClicked">
        <VideoIcon class="icon video" />
      </button>
      <div class="grabbing-area"></div>
      <div class="opacity-container">
        <Opacity />
      </div>
    </div>
    <div class="header-bottom">
      <component :is="mode" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Opacity from '../Atoms/Opacity.vue';
import WebIcon from '../Icons/Web.vue';
import VideoIcon from '../Icons/Video.vue';
import Web from '../Controllers/Web.vue';
import Video from '../Controllers/Video.vue';

export default Vue.extend({
  components: {
    Opacity,
    WebIcon,
    VideoIcon,
    Web,
    Video,
  },
  data() {
    return {
      opacity: 1,
    };
  },
  computed: {
    mode(): string {
      return this.$store.state.mode;
    },
  },
  methods: {
    onClickOpenSettings(): void {
      this.$store.commit('openSettings');
    },
    onClickCloseSettings(): void {
      this.$store.commit('closeSettings');
    },
    onVideoClicked(): void {
      this.$store.commit('changeModeToVideo');
    },
    onWebClicked(): void {
      this.$store.commit('changeModeToWeb');
    },
    onListClicked(): void {
      this.$store.commit('toggleController');
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
}
.header-top,
.header-bottom {
  position: relative;
  display: grid;
}
.header-top {
  grid-template-columns: 64px 64px 1fr 160px;
  height: 22px;
  .grabbing-area {
    -webkit-app-region: drag;
    cursor: grab;
  }
  .btn {
    padding: 0;
    width: 64px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    &:hover {
      background: #ddd;
    }
    &.active {
      .icon {
        fill: #ddd;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      fill: #444;
    }
  }
  .opacity-container {
    margin: 0 16px 0 0;
    width: 160px;
    height: 100%;
  }
}
.header-bottom {
  height: 26px;
  -webkit-app-region: no-drag;
}
</style>
