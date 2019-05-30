<template>
  <div class="container">
    <input
      class="opacity-range"
      type="range"
      from="0"
      to="100"
      v-model="opacity"
      @change="onChangeOpacity"
    >
    <span class="opacity-value">{{ opacity }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      opacity: 100,
    };
  },
  methods: {
    onChangeOpacity() {
      this.$store.commit('changeOpacity', { value: this.opacity });
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 24px;
  height: 100%;
}
.opacity-range {
  height: 100%;
  font-size: 14px;
  text-align: center;
  appearance: none;
  background-color: #999;
  margin: 10px 0 0;
  height: 4px;
  width: 100%;
  border-radius: 2px;
  &:focus,
  &:active {
    outline: none;
  }
  &::-webkit-slider-thumb {
    appearance: none;
    cursor: pointer;
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.7);
    width: 20px;
    height: 20px;
    display: block;
    background-color: #fff;
    border-radius: 50%;
  }
  &:active::-webkit-slider-thumb {
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.6);
    transition: 0.4s;
  }
}
.opacity-value {
  display: inline-block;
  width: 32px;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
  line-height: 24px;
}
</style>
