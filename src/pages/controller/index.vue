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
  NForm,
  NFormItem,
  NSlider,
  NInputNumber,
  NIcon,
  NSpace,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NRow,
} from 'naive-ui';
import { Icon } from '@iconify/vue';

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
      opacity: 50,
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
const webOpenUrl = () => {
  ipc.send('viewer:web', { action: 'open-url', url: state.web.url });
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
  <NLayout vertical>
    <NLayoutHeader class="header">
      <h1>Polidium</h1>
    </NLayoutHeader>
    <NLayoutContent>
      <NCard boardered="false">
        <NTabs default-value="settings" justify-content="space-evenly" type="line">
          <!-- Web -->
          <NTabPane name="web" tab="Web" class="tab-panel">
            <NSpace>
              <NButton :disabled="canWebBack" @click="webBack">
                <NIcon>
                  <Icon icon="ic:round-arrow-back" />
                </NIcon>
              </NButton>
              <NButton @click="webReload">
                <NIcon>
                  <Icon icon="ic:round-refresh" />
                </NIcon>
              </NButton>
              <NButton :disabled="canWebForward" @click="webForward">
                <NIcon>
                  <Icon icon="ic:round-arrow-forward" />
                </NIcon>
              </NButton>
            </NSpace>
            <NCard>
              <NForm @submit.prevent="webOpenUrl">
                <NInput v-model:value="state.web.url" placeholder="https://" />
              </NForm>
              <NList title="History">
                <NListItem></NListItem>
              </NList>
            </NCard>
          </NTabPane>
          <!-- Video -->
          <NTabPane name="video" tab="Video" class="tab-panel">
            <NSpace vertical v-if="state.video.files.length">
              <NSpace>
                <NButton :disabled="canVideoPrevious" @click="videoPrevious">
                  <NIcon>
                    <Icon icon="ic:round-skip-previous" />
                  </NIcon>
                </NButton>
                <NButton v-if="state.video.isPlaying" @click="videoPlayPause(false)">
                  <NIcon>
                    <Icon icon="ic:round-pause" />
                  </NIcon>
                </NButton>
                <NButton v-else :disabled="canVideoPlay" @click="videoPlayPause(true)">
                  <NIcon>
                    <Icon icon="ic:round-play-arrow" />
                  </NIcon>
                </NButton>
                <NButton :disabled="canVideoNext" @click="videoNext">
                  <NIcon>
                    <Icon icon="ic:round-skip-next" />
                  </NIcon>
                </NButton>
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
                <n-text style="font-size: 16px">Drop Video File</n-text>
              </NUploadDragger>
            </NUpload>
          </NTabPane>
          <!-- Settings -->
          <NTabPane name="settings" tab="Settings" class="settings">
            <NFormItem label="Opacity">
              <NSlider v-model:value="state.settings.player.opacity" :min="0" :max="100" />
              <NInputNumber v-model:value="state.settings.player.opacity" size="tiny" :min="0" :max="100" class="opacity-number" />
            </NFormItem>
            <NFormItem :showLabel="false">
              <NButton @click="resizeViewer">Resize Mode</NButton>
            </NFormItem>
          </NTabPane>
        </NTabs>
      </NCard>
    </NLayoutContent>
  </NLayout>
</template>
<style lang="scss" scoped>
.controller {
  height: 100%;
}
.header {
  padding: 4px 8px;
  -webkit-app-region: drag;
  h1 {
    font-size: 12px;
    margin: 0;
    padding: 4px 8px;
    text-align: center;
  }
}
.settings {
  .opacity-number {
    margin-left: 8px;
    width: 120px;
  }
}
</style>
