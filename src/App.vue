<template>
  <div id="app" ref="app">
    <ResetCSS />
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import ResetCSS from './components/ResetCSS.vue';

export default Vue.extend({
  components: {
    ResetCSS,
  },
});
</script>

<style>
html,
body {
  height: 100%;
  background: transparent;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
