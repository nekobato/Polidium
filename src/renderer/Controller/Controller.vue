<template>
  <div
    class="my-controller"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @dragend.prevent="onDragEnd"
    @drop.prevent="onDrop"
  >
    <div class="header">
      <h1 class="title">Polidium</h1>
      <el-button class="quit" circle size="small">
        <Icon icon="mingcute:power-line" @click="quit" />
      </el-button>
    </div>
    <div class="blue-grey my-header">
      <el-button class="opacity" size="small">
        <Icon icon="mingcute:eye-2-line" />
      </el-button>
      <el-segmented v-model="currentView" :options="options" size="small" class="my-toggle" @change="switchView">
        <template #default="{ item }">
          <Icon :icon="item.icon" class="icon" />
          <span class="label">{{ item.label }}</span>
        </template>
      </el-segmented>
      <el-button class="resize" size="small">
        <Icon icon="mingcute:aspect-ratio-line" />
      </el-button>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { useVideoStore } from "@/renderer/store/modules/video";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import { ElButton } from "element-plus";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

const router = useRouter();
const route = useRoute();
const videoStore = useVideoStore();
const settingsStore = useSettingsStore();

const options = [
  { label: "file", value: "/controller/file", icon: "mingcute:file-line" },
  { label: "Web", value: "/controller/web", icon: "mingcute:world-2-line" },
];

const currentView = ref(settingsStore.player.mode === "web-player" ? "/controller/web" : "/controller/file");

if (route.path === "/controller") {
  router.replace(currentView.value);
}

// sync currentView with current route
watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/controller/web")) currentView.value = "/controller/web";
    else if (path.startsWith("/controller/file")) currentView.value = "/controller/file";
    else currentView.value = "";
  },
  { immediate: true },
);

function switchView(path: string) {
  router.push(path);
  if (path.startsWith("/controller/web")) {
    settingsStore.changeMode("web-player");
    ipc.commit(types.CHANGE_MODE, "web-player");
  } else if (path.startsWith("/controller/file")) {
    settingsStore.changeMode("video-player");
    ipc.commit(types.CHANGE_MODE, "video-player");
  }
}

function quit() {
  ipc.commit("QUIT");
}

const isSettings = computed(() => route.path.startsWith("/controller/settings"));

function onDragOver(_e: DragEvent) {
  return false;
}

function onDragLeave(_e: DragEvent) {
  return false;
}

function onDragEnd(_e: DragEvent) {
  return false;
}

async function onDrop(e: DragEvent) {
  if (!e.dataTransfer) return false;
  const files = e.dataTransfer.files;

  for (const file of files) {
    // ビデオファイルタイプの判定をより広く
    if (file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".webm") || file.name.endsWith(".mov")) {
      try {
        const absoluteFilePath = ipc.getFilePath(file);

        if (absoluteFilePath) {
          console.log("Got absolute path from main process:", absoluteFilePath);

          videoStore.dropFile({
            file: {
              name: file.name,
              path: absoluteFilePath,
            },
          });
        }
      } catch (error) {
        console.error("Error processing file:", file.name, error);
      }
    }
  }
  return false;
}

onMounted(() => {
  console.log("[Controller]");
});
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #f6ecc2;
  height: 40px;
  padding: 0 8px;
  width: 100%;
  -webkit-app-region: drag;

  .title {
    font-size: 16px;
    font-weight: normal;
    margin: auto;
  }

  .quit {
    position: absolute;
    right: 8px;
    -webkit-app-region: no-drag;
  }
}
.my-controller {
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.my-header {
  display: flex;
  flex-shrink: 0;
  height: 36px;
  align-items: center;
  justify-content: center;
  position: relative;
}
.my-settings {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 1rem;
  color: #fff;
}
.my-toggle .icon {
  margin-right: 4px;
}
</style>
