<template>
  <div
    class="my-controller"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @dragend.prevent="onDragEnd"
    @drop.prevent="onDrop"
  >
    <div class="blue-grey my-header">
      <el-segmented
        v-model="currentView"
        :options="options"
        size="small"
        class="my-toggle"
      >
        <template #default="{ item }">
          <Icon :icon="item.icon" class="icon" />
          <span class="label">{{ item.label }}</span>
        </template>
      </el-segmented>
      <button
        class="waves-effect waves-teal btn-flat my-settings"
        @click="switchView('Settings')"
        :class="{ 'my-on': currentView === 'Settings' }"
      >
        <Icon icon="mingcute:settings-6-line" />
      </button>
    </div>
    <component :is="currentView" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

const options = [
  { label: "file", value: "FileController", icon: "mingcute:file-line" },
  { label: "Web", value: "WebController", icon: "mingcute:world-2-line" }
];

const currentView = ref("FileController");

function switchView(viewName: "FileController" | "WebController" | "Settings") {
  currentView.value = viewName;
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

function onDrop(e: DragEvent) {
  if (!e.dataTransfer) return false;
  const files = e.dataTransfer.files;
  for (const file of files) {
    if (file.type === "video/mp4") {
      ipc.commit(types.DROP_FILE, {
        file: {
          name: file.name,
          path: (file as any).path
        }
      });
    }
  }
  return false;
}
</script>

<style lang="scss">
body,
html {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
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
