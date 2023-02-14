<template>
  div.resize div.restore(@click="onRestore") i.material-icons
  settings_backup_restore span.text Restore
</template>
<script lang="ts">
const ipc = require("renderer/ipc");
const types = require("root/mutation-types");

module.exports = {
  name: "resize-mode",
  computed: {
    resizeMode() {
      return this.$store.state.settings.player.resizeMode;
    },
  },
  methods: {
    onRestore() {
      ipc.commit(types.RESIZE_PLAYER, { mode: false });
    },
  },
};
</script>
<style lang="scss" scoped>
.resize
  -webkit-app-region: drag
  position: absolute
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  margin: 0
  width: 100%
  height: 100%
  background: #fff
  cursor: move
.restore
  display: flex
  flex-direction: column
  color: #b2b2b2
  cursor: pointer
  &:hover
    color: #888
  .material-icons
    font-size: 48px
  .text
    font-soze: 14px
</style>
