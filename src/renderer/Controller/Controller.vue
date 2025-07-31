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
    <div class="actions">
      <el-popover
        placement="bottom"
        width="calc(100% - 8px)"
        trigger="click"
        v-model:visible="showOpacityPopover"
        popper-class="opacity-popover"
      >
        <template #reference>
          <el-button class="opacity" size="small" :class="{ active: showOpacityPopover }">
            <Icon icon="mingcute:eye-2-line" />
          </el-button>
        </template>

        <el-form-item class="opacity-input" :label="`${opacityFloor}%`">
          <el-slider :model-value="opacity" :min="0" :max="100" @input="handleOpacityChange" />
        </el-form-item>
      </el-popover>

      <el-segmented v-model="currentView" :options="options" size="small" class="my-toggle" @change="switchView">
        <template #default="{ item }">
          <Icon :icon="item.icon" class="icon" />
          <span class="label">{{ item.label }}</span>
        </template>
      </el-segmented>

      <el-button class="resize" size="small" :class="{ active: isResizeMode }" @click="handleResize">
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
import { ElButton, ElPopover, ElSlider, ElFormItem } from "element-plus";
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

// Opacity関連
const showOpacityPopover = ref(false);
const opacity = computed(() => settingsStore.player.opacity * 100);
const opacityFloor = computed(() => Math.floor(opacity.value));

function handleOpacityChange(value: number | number[]) {
  const numValue = Array.isArray(value) ? value[0] : value;
  const opacityValue = numValue / 100;
  settingsStore.changeOpacity(opacityValue);
  ipc.commit(types.CHANGE_OPACITY, opacityValue);
}

// Resize関連
const isResizeMode = computed(() => settingsStore.player.resizeMode);

function handleResize() {
  const newMode = !isResizeMode.value;
  settingsStore.resizePlayer({ mode: newMode });
}

function quit() {
  ipc.commit("QUIT");
}

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

  // 初期状態に戻す
  if (settingsStore.player.resizeMode) {
    settingsStore.player.resizeMode = false;
  }
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
.actions {
  display: flex;
  flex-shrink: 0;
  height: 36px;
  align-items: center;
  justify-content: center;
  position: relative;

  .opacity,
  .resize {
    &.active {
      background-color: var(--el-color-primary);
      color: white;
    }
  }

  .opacity {
    margin: 0 auto 0 8px;
  }

  .resize {
    margin: 0 8px 0 auto;
  }
}
.opacity-input {
  align-items: center;
}
</style>

<style lang="scss">
.opacity-popover {
  width: 100%;
  .el-form-item {
    margin-bottom: 0;
  }

  .el-slider {
    margin: 8px 0;
  }
}
</style>
