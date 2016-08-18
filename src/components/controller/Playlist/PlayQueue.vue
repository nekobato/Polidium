<template lang="jade">
ul.collection(v-sortable)
  li.collection-item.queue(
    v-for='file in filelist'
    @dragover.prevent="onDragOver($index)"
    @dragleave.prevent="onDragLeave($index)"
    @drop.prevent="onDrop($event, $index)")
    span.file-name {{file.name}}
    span.badge.file-type
      i.badge.material-icons.tiny(v-text='file | file2IconName')
    div.droparea(:class="{ dragging: file.status.isDragOver }")
</template>

<script>
import store from 'store'

export default {
  vuex: {
    actions: {
      addQueue(file) {
        // file type validation XXX fixme
        if (file.type !== 'video/mp4') return

        this.$data.filelist.splice(index, 0, {
          name: file.name,
          path: file.path,
          status: {
            isDragOver: false,
            isPlaying: false
          }
        })
      }
    }
  },
  filters: {
    file2IconName: function(file) {
      if (/\.(mp4|mpe?g)$/.test(file.name)) {
        return "video_library"
      } if (file.type === "directory") {
        return "folder"
      }
    }
  },

  methods: {
    onDragOver (index) {
      this.$data.filelist[index].isDragOver = true
    },
    onDragLeave (index) {
      this.$data.filelist[index].isDragOver = false
    },
    onDrop (e, index) {
      this.addQueue(file = e.dataTransfer.files[0])
      this.$data.filelist[index].isDragOver = false
      return false
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~stylesheets/variable'

.queue
  position: relative
.droparea
  position: absolute
  top: -4px
  left: 0
  width: 100%
  height: 8px
  &.dragging
    top: -8px
    height: 16px
    background: #29b6f6
.file-type
  top: 12px

</style>
