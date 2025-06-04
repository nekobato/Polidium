<template>
  <div
    class="my-controller"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @dragend.prevent="onDragEnd"
    @drop.prevent="onDrop"
  >
    <div class="blue-grey my-tabs">
      <button
        class="waves-effect waves-teal btn-flat my-tab"
        @click="switchView('FileController')"
        :class="{ 'my-on': currentView === 'FileController' }"
      >
        file
      </button>
      <button
        class="waves-effect waves-teal btn-flat my-tab"
        @click="switchView('WebController')"
        :class="{ 'my-on': currentView === 'WebController' }"
      >
        Web
      </button>
      <button
        class="waves-effect waves-teal btn-flat my-tab my-settings"
        @click="switchView('Settings')"
        :class="{ 'my-on': currentView === 'Settings' }"
      >
        <i class="material-icons">settings</i>
      </button>
    </div>
    <component :is="currentView" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ipc from 'renderer/ipc'
import * as types from 'root/mutation-types'
import FileController from './FileController.vue'
import WebController from './WebController.vue'
import Settings from './Settings.vue'

const currentView = ref('FileController')

function switchView (viewName: 'FileController' | 'WebController' | 'Settings') {
  currentView.value = viewName
}

function onDragOver (_e: DragEvent) {
  return false
}

function onDragLeave (_e: DragEvent) {
  return false
}

function onDragEnd (_e: DragEvent) {
  return false
}

function onDrop (e: DragEvent) {
  if (!e.dataTransfer) return false
  const files = e.dataTransfer.files
  for (const file of files) {
    if (file.type === 'video/mp4') {
      ipc.commit(types.DROP_FILE, {
        file: {
          name: file.name,
          path: (file as any).path
        }
      })
    }
  }
  return false
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
.my-tabs {
  display: flex;
  flex-shrink: 0;
  height: 36px;
}
.my-tab {
  color: #fff;
}
.my-tab.my-on {
  background-color: rgba(0, 0, 0, 0.2);
}
.my-settings {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 1rem;
}
</style>

