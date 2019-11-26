<template>
  <div class="video-list" @dragover.prevent="onDragOver" @drop.prevent="onDrop">
    <ul class="list" v-show="!isDragOver">
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
      v-show="isDragOver || listIsEmpty"
      @dragleave.prevent="onDragLeave"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ListItem from '../Atoms/VideoListItem.vue';
import * as types from '../../mutation-types';

export default Vue.extend({
  name: 'VideoList',
  components: {
    ListItem,
  },
  data() {
    return {
      isDragOver: false,
    };
  },
  computed: {
    fileList(): any {
      return this.$store.state.video.fileList;
    },
    listIsEmpty(): boolean {
      return this.fileList.data.length === 0;
    },
  },
  methods: {
    onDrop(e: any) {
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
      this.$store.commit(types.VIDEO_LIST_ADD_FILES, filteredFiles);
      this.isDragOver = false;
    },
    onDragOver() {
      this.isDragOver = true;
    },
    onDragLeave() {
      this.isDragOver = false;
    },
    onDragEnd() {},
    selectItem(index: number) {},
  },
});
</script>

<style lang="postcss" scoped>
.video-list {
  background: #fff;
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
