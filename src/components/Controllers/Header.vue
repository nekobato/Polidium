<template>
  <div class="container">
    <div class="header-top">
      <button class="btn mode video" :class="{ active: mode === 'Video' }" @click="onVideoClicked">
        <VideoImage/>
      </button>
      <button class="btn mode web" :class="{ active: mode === 'Web' }" @click="onWebClicked">
        <WebImage/>
      </button>
      <div class="btn" @click="onListClicked">
        <ListImage/>
      </div>
      <div class="opacity-container">
        <Opacity/>
      </div>
    </div>
    <div class="header-bottom">
      <component :is="mode"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsImage from '@/assets/round-settings-24px.svg';
import WebImage from '@/assets/round-web-24px.svg';
import VideoImage from '@/assets/round-video_library-24px.svg';
import ListImage from '@/assets/round-list-24px.svg';
import Opacity from '@/components/Atoms/Opacity.vue';
import Web from '@/components/Controllers/Web.vue';
import Video from '@/components/Controllers/Video.vue';
import { controllerViews } from '../../values';

export default Vue.extend({
  name: 'header',
  components: {
    SettingsImage,
    WebImage,
    VideoImage,
    ListImage,
    Opacity,
    Web,
    Video,
  },
  data() {
    return {
      opacity: 1,
    };
  },
  computed: {
    settingsIsVisible(): boolean {
      return this.$store.state.controllerView === controllerViews.settings;
    },
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
  height: 24px;
}

.header-top {
  grid-template-columns: 64px 64px 32px 1fr 160px;
}

.mode-container {
  position: absolute;
  top: 0;
  left: 16px;
  width: 200px;
  height: 100%;
}

.opacity-container {
  position: absolute;
  top: 0;
  right: 16px;
  width: 240px;
  height: 100%;
}

.btn {
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;

  &:hover {
    background: #ddd;
  }
}
.mode {
  width: 64px;
  height: 100%;
  background: #999;
  &.video {
    /* border-radius: 16px 0 0 16px; */
  }
  &.web {
    border-left: 1px solid rgba(0, 0, 0, 0.16);
    /* border-radius: 0 16px 16px 0; */
  }
  &.active {
    background: #ddd;
  }
}

.container > a {
  text-decoration: none;
  border-left: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
