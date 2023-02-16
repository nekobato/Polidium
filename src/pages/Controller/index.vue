<script lang="ts" setup>
import { reactive } from 'vue';
import { NCard, NTabs, NTab, NTabPane, NList, NListItem, NButton, NInput, NThing, NUpload, NUploadDragger, NFormItem } from 'naive-ui';

const state = reactive({
  web: {
    url: '',
  },
  video: {
    files: [],
  },
  settings: {
    player: {
      opacity: 0.5,
    },
  },
});
</script>
<template>
  <n-tabs default-value="settings" justify-content="space-evenly" type="line">
    <n-tab-pane name="browser" tab="Browser">
      <n-card>
        <n-input v-model:value="state.web.url" placeholder="https://" />
        <n-list title="History">
          <n-list-item></n-list-item>
        </n-list>
      </n-card>
    </n-tab-pane>
    <n-tab-pane name="video" tab="Video">
      <n-upload multiple directory-dnd @change="" :max="5" v-if="!state.video.files.length">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px"> Click or drag a file to this area to upload </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            Strictly prohibit from uploading sensitive information. For example, your bank card PIN or your credit card expiry date.
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </n-tab-pane>
    <n-tab-pane name="settings" tab="Settings">
      <NFormItem title="Opacity">
        <NInputRange v-model:value="state.settings.player.opacity" />
      </NFormItem>
    </n-tab-pane>
  </n-tabs>
</template>
<style lang="scss" scoped>
.controller {
  height: 100%;
}
</style>
