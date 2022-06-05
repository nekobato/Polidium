<template>
  <div class="video-list" @dragover.prevent="onDragOver" @drop.prevent="onDrop">
    <ul class="list" v-show="!data.isDragOver">
      <ListItem
        class="list-item"
        v-for="(file, index) in fileList.data"
        :key="index"
        :index="index"
        :title="file.name"
      />
    </ul>
    <div
      class="droppable-frame"
      v-show="data.isDragOver || listIsEmpty"
      @dragleave.prevent="onDragLeave"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import ListItem from '../Atoms/VideoListItem.vue';
import * as types from '@/../../mutation-types';
import { useStore } from '@/store';

const store = useStore();

const data = reactive({
  isDragOver: false,
});

const fileList: { isVisible: boolean; data: { name: string }[] } = store.state.video.fileList;

const listIsEmpty = computed((): boolean => {
  return fileList.data.length === 0;
});

const onDrop = (e: any) => {
  const files = e.dataTransfer.files as any[];
  let filteredFiles = [];
  for (let i = 0; i < files.length; i++) {
    if (/^video*/.test(files[i].type)) {
      filteredFiles.push({
        name: files[i].name,
        path: files[i].path,
      });
    }
  }
  store.commit(types.VIDEO_LIST_ADD_FILES, filteredFiles);
  data.isDragOver = false;
};
const onDragOver = () => {
  data.isDragOver = true;
};
const onDragLeave = () => {
  data.isDragOver = false;
};
const onDragEnd = () => {};
const selectItem = (index: number) => {};
</script>

<style lang="postcss" scoped>
.video-list {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 16px;
  overflow-y: scroll;
  .droppable-frame {
    padding: 8px;
    width: 100%;
    height: 100%;
    &:before {
      content: '';
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      border: 2px dashed rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    .add-item-icon {
      width: 32px;
      height: 32px;
      fill: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
