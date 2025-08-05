<template>
  <div class="web">
    <div class="navigation-controls">
      <el-dropdown trigger="contextmenu" :disabled="webStore.backHistory.length === 0" @command="goToHistoryIndex">
        <el-button :disabled="!webStore.navigationState.canGoBack" @click="goBack" plain circle class="nav-btn" @contextmenu.prevent>
          <Icon icon="mingcute:arrow-left-line" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(entry, index) in webStore.backHistory"
              :key="index"
              :command="webStore.navigationHistory.currentIndex - 1 - index"
            >
              {{ entry.title || entry.url }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="contextmenu" :disabled="webStore.forwardHistory.length === 0" @command="goToHistoryIndex">
        <el-button :disabled="!webStore.navigationState.canGoForward" @click="goForward" plain circle class="nav-btn" @contextmenu.prevent>
          <Icon icon="mingcute:arrow-right-line" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(entry, index) in webStore.forwardHistory"
              :key="index"
              :command="webStore.navigationHistory.currentIndex + 1 + index"
            >
              {{ entry.title || entry.url }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button :disabled="!webStore.src" @click="reload" plain circle class="nav-btn">
        <Icon icon="mingcute:refresh-1-line" />
      </el-button>
    </div>
    <form @submit.prevent="submitURL">
      <div class="input-field">
        <el-input
          id="url_input"
          class="url-input"
          placeholder="https://"
          v-model="url"
          @keydown.86="tryPasteClipboard"
          type="textarea"
          @keydown.enter="submitURL"
        />
      </div>
      <el-button type="primary" native-type="submit" round class="submit-btn">
        <Icon icon="mingcute:play-line" />
      </el-button>
    </form>
    <div class="row click-through">
      <div class="col s6 no-padding">
        <span class="grey-text">Click through</span>
      </div>
      <div class="col s6 no-padding">
        <div class="switch">
          <label>
            <el-switch :model-value="clickThrough" active-text="On" inactive-text="Off" @change="inputClickThrough" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";
import xss from "xss";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import { useWebStore } from "@/renderer/store/modules/web";
import { Icon } from "@iconify/vue";

const settingsStore = useSettingsStore();
const webStore = useWebStore();
const url = ref("");
const buttonText = ref("Submit");
const defaultButtonText = "Submit";

// webStore.currentUrlを監視してurlインプットに反映
watch(
  () => webStore.currentUrl,
  (newUrl) => {
    if (newUrl) {
      url.value = newUrl;
    }
  },
  { immediate: true },
);

const encodedURL = computed(() => {
  let encoded = url.value.trim();
  if (encoded && !/^https?:\/\//.test(encoded)) {
    encoded = "https://" + encoded;
  }
  return xss(encoded);
});

const clickThrough = computed(() => settingsStore.player.clickThrough);

function submitURL() {
  const target = encodedURL.value;
  if (!target.match(/^https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+\$,%#]+$/)) {
    buttonText.value = "Invalid URL";
    setTimeout(() => {
      buttonText.value = defaultButtonText;
    }, 1000);
    return false;
  }
  webStore.openUrl({ src: target });
  settingsStore.openUrl();
  ipc.commit(types.OPEN_URL, { src: target });
}

function tryPasteClipboard(e: KeyboardEvent) {
  if (e.metaKey !== true) return;
  url.value = ipc.readClipboardText();
}

function inputClickThrough(value: boolean) {
  settingsStore.setClickthrough({ clickThrough: value });
  ipc.commit(types.SET_CLICKTHROUGH, { clickThrough: value });
}

function goBack() {
  ipc.commit(types.WEB_GO_BACK, {});
}

function goForward() {
  ipc.commit(types.WEB_GO_FORWARD, {});
}

function reload() {
  ipc.commit(types.WEB_RELOAD, {});
}

function goToHistoryIndex(index: number) {
  ipc.commit(types.WEB_GO_TO_INDEX, { index });
}
</script>

<style lang="scss" scoped>
.web {
  padding: 20px;
}
.navigation-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}
.nav-btn {
  flex: 0 0 auto;
  color: #ffffff;

  &:disabled {
    color: #b0b0b0;
  }
}
.input-field label {
  display: inline-block;
  word-break: break-all;
  overflow: hidden;
}
.url-input {
  width: 100%;
  margin: 0 auto;

  :deep(.el-textarea__inner) {
    resize: none;
    height: 80px;
  }
}
.click-through {
  display: flex;
  padding-top: 16px;
  justify-content: space-between;
  align-items: center;
}
.switch {
  text-align: center;
}
.submit-btn {
  width: 112px;
  margin: 8px auto 0;
  display: block;
}

:deep(.el-dropdown-menu__item) {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
