<template lang="jade">
div.playlist
  div.empty-queue(v-show="queueIsEmpty")
    span.grey-text Drop Movie files?
  ul.collection(v-show="!queueIsEmpty")
    li.collection-item(v-for="(queue, index) in queues",
      @click.prevent='playOrWait(index)')
      i.material-icons.grey-text.playlist-deleter(
        @click.prevent='remove(index)') close
      span.truncate {{ queue.name }}
</template>
<script>
const types = require('../mutation-types')

module.exports = {
  name: 'FileController',
  computed: {
    queues () {
      return this.$store.state.file.queues
    },
    queueIsEmpty () {
      return this.queues.length > 0 ? false : true
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
  background: #fff
  overflow-y: scroll
.empty-queue
  display: flex
  align-items: center
  justify-content: center
  margin: 20px auto 0
  border: 2px dotted #ccc
  border-radius: 5px
  width: 280px
  height: 310px
</style>
