<template>
  <div class="container">
    <div class="mode-container">
      <button class="btn mode video" :class="{ active: mode === 'Video' }" @click="onVideoClicked">
        <VideoImage/>
      </button>
      <button class="btn mode web" :class="{ active: mode === 'Web' }" @click="onWebClicked">
        <WebImage/>
      </button>
    </div>
    <div class="opacity-container">
      <input
        class="input-opacity"
        type="range"
        from="0"
        to="100"
        v-model="opacity"
        @change="onChangeOpacity"
      >
      <span class="value-opacity">{{ opacity }}</span>
    </div>
    <div class="btn" @click="onListClicked">
      <ListImage/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SettingsImage from "@/assets/round-settings-24px.svg";
import WebImage from "@/assets/round-web-24px.svg";
import VideoImage from "@/assets/round-video_library-24px.svg";
import ListImage from "@/assets/round-list-24px.svg";
import { controllerViews } from "../../values";

export default Vue.extend({
  components: {
    SettingsImage,
    WebImage,
    VideoImage,
    ListImage
  },
  data() {
    return {
      opacity: 1
    };
  },
  computed: {
    settingsIsVisible(): boolean {
      return this.$store.state.controllerView === controllerViews.settings;
    },
    mode(): string {
      return this.$store.state.mode;
    }
  },
  methods: {
    onClickOpenSettings(): void {
      this.$store.commit("openSettings");
    },
    onClickCloseSettings(): void {
      this.$store.commit("closeSettings");
    },
    onVideoClicked(): void {
      this.$store.commit("changeModeToVideo");
    },
    onWebClicked(): void {
      this.$store.commit("changeModeToWeb");
    },
    onListClicked(): void {
      this.$store.commit("toggleController");
    },
    onChangeOpacity() {}
  }
});
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 100%;
  user-select: none;
}

.mode-container {
  position: absolute;
  top: 0;
  left: 16px;
}

.opacity-container {
  position: absolute;
  top: 0;
  right: 16px;
}

.btn {
  padding: 0 8px;
  width: 40px;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
}
.btn:hover {
  background: #ddd;
}
.mode {
  padding: 0 8px;
  width: 48px;
  height: 24px;
  background: #999;
}
.mode.video {
  /* border-radius: 16px 0 0 16px; */
}
.mode.web {
  border-left: 1px solid rgba(0, 0, 0, 0.16);
  /* border-radius: 0 16px 16px 0; */
}
.mode.active {
  background: #ddd;
}
.container > a {
  text-decoration: none;
  border-left: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
