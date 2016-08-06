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
    div.droparea(:class="{ dragging: file.isDragOver }")
</template>

<script>

export default {
  data () {
    return {
      filelist: [
        { name: 'list1.mp4', path: '/Users/nekobato/Moives/list1.mp4', isDragOver: false },
        { name: 'list2.mp4', path: '/Users/nekobato/Moives/list1.mp4', isDragOver: false },
        { name: 'list3.mp4', path: '/Users/nekobato/Moives/list1.mp4', isDragOver: false },
        { name: 'list4.mp4', path: '/Users/nekobato/Moives/list1.mp4', isDragOver: false },
        { name: 'list5.mp4', path: '/Users/nekobato/Moives/list1.mp4', isDragOver: false }
      ]
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
      this.$data.filelist[index].isDragOver = false
      const file = e.dataTransfer.files[0]
      // name, path
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
