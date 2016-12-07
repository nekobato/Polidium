<template lang="jade">
div.playlist
  ul.collection
    li.collection-item(v-for="(queue, index) in queues",
      @click.prevent='playOrWait(index)')
      i.material-icons.grey-text.playlist-deleter(
        @click.prevent='remove(index)') close
      span.truncate {{ queue.name }}
</template>
<script>
const types = require('../mutation-types')

module.exports = {
  name: 'file',
  computed: {
    queues () {
      return this.$store.state.file.queues
    }
  },
  methods: {
    playOrWait (index) {
      this.$store.commit(types.PLAY_FILE, index)
    },
    remove (index) {
      this.$store.commit(types.REMOVE_QUEUE, index)
    }
  }
}
</script>
<style lang="stylus" scoped>

.play-controller
  text-align: center

.collection
  width: 100%

.playlist-deleter
  right: 5px
  display: none
  position: absolute

.collection-item
  position: relative
  cursor: pointer
  &:hover
    .playlist-deleter
      display: inline-block

.playlist
  margin: 0
  width: 100%
  height: 100%
  background: #ffffff
  overflow-y: scroll
</style>
