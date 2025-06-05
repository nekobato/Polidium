<template>
  <div class="resize">
    <div class="restore" @click="onRestore">
      <Icon icon="mingcute:restore-line" class="icon" />
      <span class="text">Restore</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";
import { Icon } from "@iconify/vue";

function onRestore() {
  ipc.commit(types.RESIZE_PLAYER, { mode: false });
}
</script>

<style lang="scss" scoped>
.resize {
  -webkit-app-region: drag;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: move;
}

.restore {
  display: flex;
  flex-direction: column;
  color: #b2b2b2;
  cursor: pointer;
}

.restore:hover {
  color: #888;
}

.restore .icon {
  font-size: 48px;
}

.restore .text {
  font-size: 14px;
}
</style>
