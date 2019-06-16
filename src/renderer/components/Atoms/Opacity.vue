<template>
  <div class="container">
    <input class="opacity-range" type="range" from="0" to="100" v-model="opacity" />
    <span class="opacity-value">{{ opacity }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    opacity: {
      get(): number {
        return this.$store.state.settings.opacity;
      },
      set(value: number) {
        this.$store.commit('changeOpacity', { value });
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 28px;
  padding-right: 4px;
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
    width: 16px;
    height: 16px;
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
  display: block;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
  line-height: 24px;
}
</style>
