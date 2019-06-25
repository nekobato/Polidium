<template>
  <div class="video-list">
    <div class="droppable-frame" v-show="onDrag">
      <div class="dashed-frame">
        <AddToListIcon class="add-item-icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddToListIcon from '../Icons/AddToList.vue';

export default Vue.extend({
  name: 'VideoList',
  components: {
    AddToListIcon,
  },
  data() {
    return {
      onDrag: false,
    };
  },
  methods: {},
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
