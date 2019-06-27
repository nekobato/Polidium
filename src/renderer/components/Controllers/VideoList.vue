<template>
  <div class="video-list" @dragover="onDragOver">
    <ul class="list">
      <ListItem
        class="list-item"
        v-for="(file, index) in fileList.data"
        :key="index"
        :index="index"
        :title="file.name"
      />
    </ul>
    <div class="droppable-frame" v-show="isDragOver" @drop="onDrop" @dragleave="onDragLeave"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddToListIcon from '../Icons/AddToList.vue';
import ListItem from '../Atoms/VideoListItem.vue';
import * as types from '../../../shared/mutation-types';

export default Vue.extend({
  name: 'VideoList',
  components: {
    AddToListIcon,
    ListItem,
  },
  data() {
    return {
      isDragOver: false,
    };
  },
  computed: {
    fileList(): any[] {
      return this.$store.state.video.fileList;
    },
  },
  methods: {
    onDrop(e: any) {
      const files = e.target.files as any[];
      console.log(files);
      this.$store.commit(
        types.VIDEO_LIST_ADD_FILE,
        files.filter(file => {
          if (file.type.match('video.*')) {
            return true;
          }
        }),
      );
    },
    onDragOver() {
      this.isDragOver = true;
      console.log('over');
    },
    onDragLeave() {
      this.isDragOver = false;
      console.log('leave');
    },
  },
});
</script>

<style lang="scss" scoped>
.video-list {
  background: #fff;
  .droppable-frame {
    padding: 8px;
    width: 100%;
    height: 100%;
    .dashed-frame {
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
