<template>
  <div class="white settings">
    <div class="row">
      <div class="input-field center opacity">
        <el-slider
          id="opacity_range"
          class="range validate"
          :model-value="opacity"
          :min="0"
          :max="100"
          @input="inputOpacity"
        />
        <label for="opacity_range" class="label"
          >Opacity is {{ opacityFloor }}</label
        >
        <div class="min-max grey-text">
          <span class="min">0</span>
          <span class="max">100</span>
        </div>
      </div>
    </div>
    <div class="row center resize">
      <div class="btn" @click="resizePlayer">
        <Icon icon="mingcute:transformation-line" class="left" />
        <span>resize player</span>
      </div>
    </div>
    <div class="row center disruptive">
      <div class="btn blue" @click="reload">
        <Icon icon="mingcute:refresh-2-line" class="left" />
        <span>reload</span>
      </div>
      <div class="btn blue" @click="reset">
        <Icon icon="mingcute:settings-6-line" class="left" />
        <span>reset settings</span>
      </div>
    </div>
    <div class="row center disruptive">
      <div class="btn red" @click="quit">
        <Icon icon="mingcute:close-line" class="left" />
        <span>quit</span>
      </div>
    </div>
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
  ipc.commit(types.RELOAD, {});
}

function reset() {
  ipc.commit(types.RESET, {});
}

function resizePlayer() {
  ipc.commit(types.RESIZE_PLAYER, { mode: true });
}

function inputOpacity(value: number) {
  ipc.commit(types.CHANGE_OPACITY, value / 100);
}
</script>

<style lang="scss">
.settings {
  padding: 20px;
}
.opacity .label {
  top: -1rem;
}
.opacity .min-max {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 1rem;
  top: -10px;
}
.opacity .min,
.opacity .max {
  position: absolute;
}
.opacity .min {
  left: 0;
}
.opacity .max {
  right: 0;
}
.displays {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.displays .btn {
  padding: 0 1rem;
}
.disruptive {
  display: flex;
}
.disruptive .btn {
  margin: auto;
  padding: 0 10px;
  width: 120px;
}
</style>
