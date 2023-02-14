<template>
  <div class="layout">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
