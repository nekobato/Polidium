<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import {
  NCard,
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NButton,
  NInput,
  NUpload,
  NUploadDragger,
  NFormItem,
  NSlider,
  NInputNumber,
  NIcon,
  NSpace,
} from 'naive-ui';

const state = reactive({
  web: {
    url: '',
    histories: [],
    canBack: false,
    canForward: false,
  },
  video: {
    isPlaying: false,
    currentFileIndex: 0,
    files: [],
  },
  settings: {
    player: {
      opacity: 0.5,
    },
  },
});

// Web
const canWebBack = computed(() => state.web.canBack);
const canWebForward = computed(() => state.web.canForward);
const webBack = () => {
  ipc.send('viewer:web', { action: 'back' });
};
const webForward = () => {
  ipc.send('viewer:web', { action: 'forward' });
};
const webReload = () => {
  ipc.send('viewer:web', { action: 'reload' });
};

// Video
const canVideoPrevious = computed(() => state.video.currentFileIndex > 0);
const canVideoNext = computed(() => state.video.currentFileIndex < state.video.files.length - 1);
const canVideoPlay = computed(() => state.video.files.length > 0);
const videoPlayPause = (isPlaying: boolean) => {
  ipc.send('viewer:video', { action: 'play-pause', isPlaying });
};
const videoPrevious = () => {
  ipc.send('viewer:video', { action: 'previous' });
};
const videoNext = () => {
  ipc.send('viewer:video', { action: 'next' });
};

// Settings
const resizeViewer = () => {
  ipc.send('viewer:resize', { mode: true });
};

const changeViewerOpacity = (value: number) => {
  ipc.send('viewer:settings', { key: 'opacity', value });
};

watch(
  () => state.settings.player.opacity,
  (value) => {
    changeViewerOpacity(value);
  }
);
</script>
<template>
  <NTabs default-value="settings" justify-content="space-evenly" type="line">
    <NTabPane name="web" tab="Web">
      <NSpace>
        <NButton :disabled="canWebBack" @click="webBack">Back</NButton>
        <NButton @click="webReload">Reload</NButton>
        <NButton :disabled="canWebForward" @click="webForward">Forward</NButton>
      </NSpace>
      <NCard>
        <NInput v-model:value="state.web.url" placeholder="https://" />
        <NList title="History">
          <NListItem></NListItem>
        </NList>
      </NCard>
    </NTabPane>
    <NTabPane name="video" tab="Video">
      <NSpace vertical v-if="state.video.files.length">
        <NSpace>
          <NButton :disabled="canVideoPrevious" @click="videoPrevious">Prev</NButton>
          <NButton v-if="state.video.isPlaying" @click="videoPlayPause(false)">Pause</NButton>
          <NButton v-else :disabled="canVideoPlay" @click="videoPlayPause(true)">Play</NButton>
          <NButton :disabled="canVideoNext" @click="videoNext">Next</NButton>
        </NSpace>
        <NList>
          <NListItem v-for="file in state.video.files" :key="file">
            {{ file }}
          </NListItem>
        </NList>
      </NSpace>
      <NUpload multiple directory-dnd @change="" :max="5" v-if="!state.video.files.length">
        <NUploadDragger>
          <div style="margin-bottom: 12px">
            <NIcon size="48" :depth="3">
              <archive-icon />
            </NIcon>
          </div>
          <n-text style="font-size: 16px"> Click or drag a file to this area to upload </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            Strictly prohibit from uploading sensitive information. For example, your bank card PIN or your credit card expiry date.
          </n-p>
        </NUploadDragger>
      </NUpload>
    </NTabPane>
    <NTabPane name="settings" tab="Settings">
      <NFormItem title="Opacity">
        <NSlider v-model:value="state.settings.player.opacity" />
        <NInputNumber v-model:value="state.settings.player.opacity" />
      </NFormItem>
      <NFormItem title="Resize Viewer">
        <NButton @click="resizeViewer">Resize Mode</NButton>
      </NFormItem>
    </NTabPane>
  </NTabs>
</template>
<style lang="scss" scoped>
.controller {
  height: 100%;
}
</style>
