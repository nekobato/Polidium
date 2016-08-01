<template lang="jade">
ul.collection
  li.collection-item.queue(
    v-for='file in filelist'
    @dragover="onDragOver($index)"
    @dragleave="onDragLeave($index)"
    @ondrop.prevent="onDrop")
    span.truncate {{file.name}}
    span.badge
      i.material-icons.tiny(v-text='file | file2IconName')
    div.droparea(v-show="file.isDropOver")
</template>

<script>

export default {
  data () {
    return {
      filelist: [
        { name: 'list1.mp4', path: '/Users/nekobato/Moives/list1.mp4', isDropOver: false }
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
      console.log(index, 'is dropover')
      this.$data.isDropOver = true
    },
    onDragLeave (index) {
      // this.$data.isDropOver = false
    },
    onDrop (e) {
      const file = e.dataTransfer.files[0];
      // name, path
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~stylesheets/variable'

.queue {
  position: relative
}
.droparea {
  position: absolute
  top: -4px
  left: 0
  width: 100%
  height: 8px
  &.dropping {
    top: -8px
    height: 16px
    background: #29b6f6
  }
}

</style>
