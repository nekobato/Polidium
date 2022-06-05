<template>
  <div
    class="clickthrough-toggle"
    :class="`{
      on: ${status},
      off: ${status},
    }`"
    @click="toggleClickThrough"
  >
    <span class="label">CLICKTHROUGH</span>
    <div class="switch" />
  </div>
</template>
<script lang="ts" setup>
const { status } = defineProps(['status']);
const emit = defineEmits(['toggle']);
const toggleClickThrough = () => {
  emit('toggle');
};
</script>
<style lang="postcss" scoped>
.clickthrough-toggle {
  --toggle-height: 20px;
  position: relative;
  margin: auto;
  width: 100px;
  height: var(--toggle-height);
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  &.on {
    .switch {
      left: 39px;
    }
  }
  &.off {
    .switch {
      left: 1px;
    }
  }
  .label {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    height: 100%;
    text-align: center;
    font-size: 10px;
    line-height: var(--toggle-height);
    font-weight: bold;
    color: hsla(0, 0%, 0%, 0.5);
  }
  .switch {
    position: absolute;
    margin: auto;
    top: 1px;
    width: 60px;
    height: calc(var(--toggle-height) - 4px);
    border-radius: 16px;
    background: hsla(0, 0%, 100%, 0.7);
    box-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.16);
    transition: all 0.2s cubic-bezier(0.2, 0.68, 0, 1);
  }
}
</style>
