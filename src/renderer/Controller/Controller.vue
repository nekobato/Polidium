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
      <div class="header-buttons">
        <el-button class="settings" circle size="small" @click="openSettingsDialog">
          <Icon :icon="isPlayerHidden ? 'mingcute:ghost-fill' : 'mingcute:ghost-line'" />
        </el-button>
        <el-button class="quit" circle size="small">
          <Icon icon="mingcute:power-line" @click="quit" />
        </el-button>
      </div>
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

      <el-segmented v-model="currentView" :options="options" size="small" class="mode-toggle" @change="switchView">
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

    <!-- 設定ダイアログ -->
    <el-dialog
      class="settings-dialog"
      v-model="showSettingsDialog"
      title="Settings"
      width="320px"
      :modal="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div class="settings-content">
        <el-form>
          <el-form-item label="Global Shortcut">
            <el-input
              v-model="globalShortcut"
              readonly
              placeholder="Press keys..."
              @focus="startCapturingShortcut"
              @blur="stopCapturingShortcut"
              @keydown="captureShortcut"
              class="shortcut-input"
            >
              <template #append>
                <el-button @click="resetShortcut" size="small">Reset</el-button>
              </template>
            </el-input>
            <p class="shortcut-hint">Toggle player opacity between 0% and {{ opacityFloor }}%</p>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { useVideoStore } from "@/renderer/store/modules/video";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import { ElButton, ElPopover, ElSlider, ElFormItem, ElInput, ElForm } from "element-plus";
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

// Settings関連
const showSettingsDialog = ref(false);
const globalShortcut = ref(settingsStore.player.globalShortcut || "Ctrl+Alt+P");
const isCapturingShortcut = ref(false);
const isPlayerHidden = computed(() => settingsStore.player.isPlayerHidden);

function openSettingsDialog() {
  showSettingsDialog.value = true;
  globalShortcut.value = settingsStore.player.globalShortcut;
}

function startCapturingShortcut() {
  isCapturingShortcut.value = true;
}

function stopCapturingShortcut() {
  isCapturingShortcut.value = false;
}

function captureShortcut(event: KeyboardEvent) {
  if (!isCapturingShortcut.value) return;
  
  event.preventDefault();
  
  const modifiers = [];
  if (event.ctrlKey || event.metaKey) modifiers.push("Ctrl");
  if (event.altKey) modifiers.push("Alt");
  if (event.shiftKey) modifiers.push("Shift");
  
  // 修飾キーのみの場合は無視
  if (["Control", "Alt", "Shift", "Meta"].includes(event.key)) {
    return;
  }
  
  // Electronのキーコードマッピング
  let key = event.key;
  if (key.length === 1) {
    key = key.toUpperCase();
  } else {
    // 特殊キーの変換
    const keyMap: Record<string, string> = {
      "ArrowUp": "Up",
      "ArrowDown": "Down",
      "ArrowLeft": "Left",
      "ArrowRight": "Right",
      " ": "Space",
    };
    key = keyMap[key] || key;
  }
  
  const shortcut = [...modifiers, key].join("+");
  globalShortcut.value = shortcut;
  settingsStore.updateGlobalShortcut(shortcut);
  
  // フォーカスを外す
  (event.target as HTMLElement).blur();
}

function resetShortcut() {
  globalShortcut.value = "Ctrl+Alt+P";
  settingsStore.updateGlobalShortcut("Ctrl+Alt+P");
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

  if (!settingsStore.player.clickThrough) {
    settingsStore.player.clickThrough = true;
  }

  settingsStore.changeOpacity(settingsStore.player.opacity);
  
  // グローバルショートカットキーを初期設定
  if (settingsStore.player.globalShortcut) {
    ipc.commit(types.UPDATE_GLOBAL_SHORTCUT, settingsStore.player.globalShortcut);
  }
  
  // SET_PLAYER_HIDDENイベントをリッスン
  ipc.on(types.SET_PLAYER_HIDDEN, (_event: unknown, isHidden: string) => {
    const hidden = JSON.parse(isHidden);
    settingsStore.setPlayerHidden(hidden);
  });
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

  .header-buttons {
    position: absolute;
    right: 8px;
    display: flex;
    gap: 8px;
    -webkit-app-region: no-drag;
  }

  .settings,
  .quit {
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
.mode-toggle {
  width: 120px;
  --el-border-radius-base: 8px;

  :deep(.el-segmented__item-label) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
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
.settings-content {
  padding: 16px 0;
}

.shortcut-input {
  width: 100%;
  
  :deep(.el-input__inner) {
    cursor: pointer;
    font-family: monospace;
  }
}

.shortcut-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
