<script lang="ts" setup>
const onMouseEnter = () => {};
</script>
<template>
  <div class="container" @mouseenter="onMouseEnter">a</div>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: red;
}
</style>
