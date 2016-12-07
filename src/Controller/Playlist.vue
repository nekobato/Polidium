<template lang="jade">
div.playlist
  div.play-controller
    button.btn-floating
      i.material-icons skip_previous
    button.btn-floating
      i.material-icons play_arrow
    button.btn-floating
      i.material-icons skip_next
  ul.collection
    li.collection-item(v-for="queue in queues", track-by="$index",
      @click.prevent='play($index)')
      i.material-icons.grey-text.playlist-deleter(
        @click.prevent='removeQueue($index)') close
      span.truncate {{ queue.name }}

</template>
<script>
import * as types from '../vuex/mutation-types'

export default {
  vuex: {
    getters: {
      queues: state => state.playlist.queues
    }
  },
  computed: {

  },
  methods: {
    onDragover (e) {
    },
    onDrop (e) {
      this.$store.dispatch(types.ADD_QUEUES, e.dataTransfer.files)
      return false
    },
    play (index) {
      this.$store.dispatch(types.PLAY_QUEUE, this.queues[index])
    },
    removeQueue (index) {
      this.$store.dispatch(types.REMOVE_QUEUE, index)
    }
  }
}
</script>
<style lang="stylus" scoped>

.play-controller
  text-align: center

.collection {
  width: 100%
}

.playlist-deleter {
  right: 5px
  display: none
  position: absolute
}

.collection-item {
  position: relative
  cursor: pointer
  &:hover {
    .playlist-deleter {
      display: inline-block
    }
  }
}

.playlist {
  margin: 0
  width: 100%
  height: 100%
  overflow-y: scroll
}
</style>
