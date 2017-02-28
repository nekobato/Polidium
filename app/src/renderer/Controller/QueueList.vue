<template lang="jade">
ul.collection(ref="queue-list", v-show="!queueIsEmpty")
  li.collection-item(v-for="(queue, index) in queues",
    @click.prevent='play(index)')
    i.material-icons.grey-text.playlist-deleter(
      @click.prevent='remove(index)') close
    span.truncate {{ queue.name }}
</template>
<script>
const ipc = require('renderer/ipc')
const types = require('root/mutation-types')
const Sortable = require('sortablejs')

module.exports = {
  name: 'queue-list',
  computed: {
    queues () {
      return this.$store.state.video.queues
    },
    queueIsEmpty () {
      return this.queues.length > 0 ? false : true
    }
  },
  methods: {
    play (index) {
      ipc.commit(types.VIDEO_SELECT, { index: index })
    },
    resume () {
      ipc.commit(types.RESUME_FILE)
    },
    remove (index) {
      ipc.commit(types.REMOVE_QUEUE, { index: index })
    }
  },
  created () {
    console.log(this.$el)
    Sortable.create(this.$el, {
      onUpdate: function (e) {
        console.log(e)
      }
    })
  }
}
</script>
<style lang="stylus" scoped>
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
</style>
