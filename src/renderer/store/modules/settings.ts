import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { computed } from "vue";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";

interface SettingsState {
  player: {
    mode: string;
    opacity: number;
    clickThrough: boolean;
    resizeMode: boolean;
    windowBounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

export const useSettingsStore = defineStore("settings", () => {
  const state = useStorage<SettingsState>("settings", {
    player: {
      mode: "video-player",
      opacity: 0.05,
      clickThrough: true,
      resizeMode: false,
    },
  });

  const player = computed(() => state.value.player);

  function changeMode(mode: string) {
    state.value.player.mode = mode;
  }

  function changeOpacity(newOpacity: number) {
    // 値が変更された場合のみ更新
    if (state.value.player.opacity === newOpacity) {
      return;
    }

    state.value.player.opacity = newOpacity;
    // リサイズモードでない場合のみBrowserWindowに適用
    if (!state.value.player.resizeMode) {
      ipc.commit(types.CHANGE_OPACITY, newOpacity);
    }
  }

  function setClickthrough(payload: { clickThrough: boolean }) {
    state.value.player.clickThrough = payload.clickThrough;
  }

  function reload() {
    window.location.reload();
  }

  function reset() {
    localStorage.removeItem("queues");
    localStorage.removeItem("settings");
    window.location.reload();
  }

  function openUrl() {
    state.value.player.mode = "web-player";
  }

  function videoSelect() {
    state.value.player.mode = "video-player";
  }

  function resizePlayer(payload: { mode: boolean }) {
    // 既に同じモードの場合は何もしない
    if (state.value.player.resizeMode === payload.mode) {
      return;
    }

    state.value.player.resizeMode = payload.mode;
    state.value.player.clickThrough = !payload.mode;

    // リサイズモード時はopacity 1、通常時は設定されたopacityを適用
    const targetOpacity = payload.mode ? 1 : state.value.player.opacity;
    ipc.commit(types.CHANGE_OPACITY, targetOpacity);
  }

  function saveWindowBounds(bounds: { x: number; y: number; width: number; height: number }) {
    state.value.player.windowBounds = bounds;
  }

  return {
    player,
    changeMode,
    changeOpacity,
    setClickthrough,
    reload,
    reset,
    openUrl,
    videoSelect,
    resizePlayer,
    saveWindowBounds,
  };
});
