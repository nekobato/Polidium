<template>
  <div class="mode-tab">
    <div class="item" @click="selectTab('web')">WEB</div>
    <div class="item" @click="selectTab('video')">VIDEO</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  methods: {
    selectTab(name: string) {
      this.$emit('selectTab', name);
    },
  },
});
</script>
<style lang="postcss" scoped>
.mode-tab {
  --height: 32px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: var(--height);
  .item {
    padding: 4px 0;
    width: 40%;
    height: 24px;
    font-size: 16px;
    line-height: 16px;
    border: 1px solid rgba(0, 0, 0, 0.32);
    border-radius: 12px;
    cursor: pointer;
  }
}
</style>
