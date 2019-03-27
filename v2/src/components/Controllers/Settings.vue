<template>
  <div class="container">
    <div class="row">
      <span class="label">Window opacity</span>
      <input class="input-opacity" type="range" from="0" to="100" v-model="opacity" />
      <span class="value-opacity">{{ opacity }}</span>
    </div>
    <div class="row">
      <span class="label">Hide on Launcher</span>
      <input type="checkbox" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return this.$store.state.settings;
  },
  methods: {
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: #ddd;
}
.row {
  position: relative;
  display: flex;
  justify-content: center;
  
  padding: 24px 0 8px;
  border: 1px solid #ccc;
}
.label {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 14px;
}

.input-opacity {
  appearance: none;
  background-color: #999;
  margin: 6px 0;
  height: 4px;
  width: 100%;
  border-radius: 2px;
}
.input-opacity:focus,
.input-opacity:active {
  outline: none;
}
.input-opacity::-webkit-slider-thumb {
  appearance: none;
  cursor: pointer;
  position: relative;
  border: 2px solid rgba(0, 0, 0, .7);
  width: 20px;
  height: 20px;
  display: block;
  background-color: #fff;
  border-radius: 50%;
}
.input-opacity:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, .6);
  transition: .4s;
}
.value-opacity {
  width: 40px;
  
}
</style>
