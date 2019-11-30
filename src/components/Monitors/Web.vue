<template>
  <div class="container"></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    controller: {
      show: true,
    },
  }),
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: #fff;
}

.web-controller {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
}
</style>
