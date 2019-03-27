<template>
  <div class="container">
    <div class="btn-container">
      <div class="btn settings open" v-show="!settingsIsVisible" @click="onClickOpenSettings">
        <SettingsImage/>
      </div>
      <div class="btn settings close" v-show="settingsIsVisible" @click="onClickCloseSettings">
        <SettingsImage/>
      </div>
    </div>
    <button class="btn mode video" @click="onVideoClicked">
      <VideoImage/>
    </button>
    <button class="btn mode web" @click="onWebClicked">
      <WebImage/>
    </button>
    <div class="btn" @click="onListClicked">
      <ListImage />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SettingsImage from "@/assets/round-settings-24px.svg";
import WebImage from "@/assets/round-web-24px.svg";
import VideoImage from "@/assets/round-video_library-24px.svg";
import ListImage from "@/assets/round-list-24px.svg";
import { controllerViews } from "@/values";

export default Vue.extend({
  components: {
    SettingsImage,
    WebImage,
    VideoImage,
    ListImage
  },
  computed: {
    settingsIsVisible(): boolean {
      return this.$store.state.controllerView === controllerViews.settings;
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
      this.$store.commit("changeController");
    }
  }
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 100%;
  user-select: none;
}

.btn {
  padding: 4px 8px;
  width: 40px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
}
.btn:hover {
  background: #ddd;
}
.mode {
  margin: 2px 0;
  padding: 2px 8px;
  width: 120px;
  height: 28px;
  background: #999;
}
.mode.video {
  /* border-radius: 16px 0 0 16px; */
}
.mode.web {
  border-left: 1px solid rgba(0, 0, 0, 0.16);
  /* border-radius: 0 16px 16px 0; */
}
.container > a {
  text-decoration: none;
  border-left: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
