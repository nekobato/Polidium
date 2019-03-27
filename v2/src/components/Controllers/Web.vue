<template>
  <div class="container">
    <div class="row">
    <button class="prev">Prev</button>
    <button class="next">Next</button>
    <button class="refresh">Refresh</button>
    </div>
    <div class="row">
      <input class="url" type="url" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  components: {}
});
</script>

<style scoped>
.container {
  display: inline-flex;
  padding: 4px;
}

.url {
  margin: 0;
  flex-grow: 1;
}
</style>
