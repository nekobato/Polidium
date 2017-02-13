<template lang="jade">
div.playlist
  div.empty-queue(v-show="queueIsEmpty")
    span.grey-text Drop Movie files? Here
  ul.collection(v-show="!queueIsEmpty")
    li.collection-item(v-for="(queue, index) in queues",
      @click.prevent='playOrWait(index)')
      i.material-icons.grey-text.playlist-deleter(
        @click.prevent='remove(index)') close
      span.truncate {{ queue.name }}
  div.blue-grey.darken-2.center.video-controller
    button.btn.play-stop-btn
      i.material-icons.white-text play_arrow
    div.seekbar-container
      input.seekbar(type="range", id="seekbar", min="0", max="100")
</template>
<script>
const ipc = require('root/ipc')
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
    play (index) {
      ipc.commit(types.PLAY_FILE, { index: index })
    },
    wait () {
      ipc.commit(types.WAIT_FILE)
    },
    remove (index) {
      ipc.commit(types.REMOVE_QUEUE, { index: index })
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
  height: 280px
.video-controller
  position: absolute
  display: flex
  bottom: 0
  width: 100%
  height: 24px
  .play-stop-btn
    display: inline-block
    padding: 0 1rem
    height: 24px
    line-height: 24px
    vertical-align: top
  .seekbar-container
    flex-grow: 1
    display: inline-block
    padding: 0 10px
    line-height: 18px;
  .seekbar
    border: 0
    border-radius: 2px
    margin: 0
</style>
