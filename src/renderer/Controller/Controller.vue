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
        @change="switchView"
      >
        <template #default="{ item }">
          <Icon :icon="item.icon" class="icon" />
          <span class="label">{{ item.label }}</span>
        </template>
      </el-segmented>
      <button
        class="waves-effect waves-teal btn-flat my-settings"
        @click="switchView('/controller/settings')"
        :class="{ 'my-on': isSettings }"
      >
        <Icon icon="mingcute:settings-6-line" />
      </button>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

const router = useRouter();
const route = useRoute();

const options = [
  { label: "file", value: "/controller/file", icon: "mingcute:file-line" },
  { label: "Web", value: "/controller/web", icon: "mingcute:world-2-line" }
];

const currentView = ref(options[0].value);

// sync currentView with current route
watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/controller/web")) currentView.value = "/controller/web";
    else if (path.startsWith("/controller/file")) currentView.value = "/controller/file";
    else currentView.value = "";
  },
  { immediate: true }
);

function switchView(path: string) {
  router.push(path);
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
