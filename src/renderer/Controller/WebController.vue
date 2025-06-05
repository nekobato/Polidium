<template>
  <div class="web">
    <form @submit.prevent="submitURL">
      <div class="input-field">
        <el-input
          id="url_input"
          placeholder="URL"
          v-model="url"
          @keydown.86="tryPasteClipboard"
        />
      </div>
    </form>
    <div class="row click-through">
      <div class="col s6 no-padding">
        <span class="grey-text">Player ClickThrough is</span>
      </div>
      <div class="col s6 no-padding">
        <div class="switch">
          <label>
            <el-switch
              :model-value="clickThrough"
              active-text="On"
              inactive-text="Off"
              @change="inputClickThrough"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ipc from "@/renderer/ipc";
import xss from "xss";
import * as types from "@/mutation-types";
import { useSettingsStore } from "@/renderer/store/modules/settings";

const settingsStore = useSettingsStore();
const url = ref("");

const encodedURL = computed(() => {
  const encoded = url.value.match(/^https?:\/\//g)
    ? url.value
    : "http://" + url.value;
  return xss(encoded);
});

const clickThrough = computed(() => settingsStore.player.clickThrough);

function submitURL() {
  if (
    !encodedURL.value.match(/^https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+\$,%#]+$/)
  ) {
    return false;
  }
  ipc.commit("OPEN_URL", { src: encodedURL.value });
}

function tryPasteClipboard(e: KeyboardEvent) {
  if (e.metaKey !== true) return;
  url.value = ipc.readClipboardText();
}

function inputClickThrough(value: boolean) {
  ipc.commit(types.SET_CLICKTHROUGH, { clickThrough: value });
}
</script>

<style lang="scss" scoped>
.web {
  padding: 20px;
}
.input-field label {
  display: inline-block;
  top: 3.5rem;
  word-break: break-all;
  max-height: 4.5rem;
  overflow: hidden;
}
.click-through {
  padding-top: 4rem;
}
.switch {
  text-align: center;
}
</style>
