<template>
  <div class="settings-page">
    <el-card shadow="never" class="settings-card">
      <el-form label-position="top" class="opacity-form">
        <el-form-item :label="`Opacity: ${opacityFloor}`">
          <el-slider
            id="opacity_range"
            :model-value="opacity"
            :min="0"
            :max="100"
            @input="inputOpacity"
          />
        </el-form-item>
      </el-form>

      <el-divider />

      <el-space direction="vertical" alignment="center" class="actions" size="large">
        <el-button @click="resizePlayer">
          <Icon icon="mingcute:transformation-line" class="icon" />
          <span>Resize Player</span>
        </el-button>

        <el-button type="primary" @click="reload">
          <Icon icon="mingcute:refresh-2-line" class="icon" />
          <span>Reload</span>
        </el-button>

        <el-button type="primary" @click="reset">
          <Icon icon="mingcute:settings-6-line" class="icon" />
          <span>Reset Settings</span>
        </el-button>

        <el-button type="danger" @click="quit">
          <Icon icon="mingcute:close-line" class="icon" />
          <span>Quit</span>
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore);
const opacity = computed(() => settings.value.player.opacity * 100);
const opacityFloor = computed(() =>
  Math.floor(settings.value.player.opacity * 100)
);

function quit() {
  ipc.commit(types.QUIT, {});
}

function reload() {
  settingsStore.reload();
}

function reset() {
  settingsStore.reset();
}

function resizePlayer() {
  settingsStore.resizePlayer({ mode: true });
}

function inputOpacity(value: number) {
  settingsStore.changeOpacity(value / 100);
}
</script>

<style lang="scss">
.settings-page {
  padding: 20px;
}

.actions .icon {
  margin-right: 4px;
}
</style>
