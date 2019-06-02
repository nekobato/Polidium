<template>
  <div class="container">
    <div class="header-top">
      <button class="btn mode video" :class="{ active: mode === 'Video' }" @click="onVideoClicked">
        <VideoIcon class="icon video"/>
      </button>
      <button class="btn mode web" :class="{ active: mode === 'Web' }" @click="onWebClicked">
        <WebIcon class="icon video"/>
      </button>
      <div class="btn" @click="onListClicked">
        <ListIcon class="icon list"/>
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
import Opacity from '@/components/Atoms/Opacity.vue';
import WebIcon from '@/components/Icons/Web.vue';
import VideoIcon from '@/components/Icons/Video.vue';
import ListIcon from '@/components/Icons/List.vue';
import Web from '@/components/Controllers/Web.vue';
import Video from '@/components/Controllers/Video.vue';
import { controllerViews } from '../../values';

export default Vue.extend({
  components: {
    ListIcon,
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
.opacity-container {
  position: absolute;
  top: 0;
  right: 16px;
  width: 240px;
  height: 100%;
  -webkit-app-region: no-drag;
}
.btn {
  padding: 0;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  &:hover {
    background: #ddd;
  }
  .mode {
    width: 64px;
    height: 24px;
    &.video {
      /* border-radius: 16px 0 0 16px; */
    }
    &.web {
      border-left: 1px solid rgba(0, 0, 0, 0.16);
      /* border-radius: 0 16px 16px 0; */
    }
    &.active {
      .icon {
        fill: #ddd;
      }
    }
  }
  .icon {
    width: 24px;
    height: 24px;
  }
}
</style>
