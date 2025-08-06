<template>
  <div class="resize">
    <el-button class="restore" @click="onRestore" size="large">
      <Icon icon="mingcute:restore-line" class="icon" />
      <span class="text">Restore</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ElButton } from "element-plus";
import ipc from "@/ipc";
import * as types from "@/mutation-types";

function onRestore() {
  // リサイズモードを終了
  ipc.commit(types.RESIZED_PLAYER);
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
  background-color: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.restore {
  -webkit-app-region: no-drag;

  .icon {
    font-size: 20px;

    & + .text {
      margin-left: 12px;
    }
  }
}
</style>
