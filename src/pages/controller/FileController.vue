<template>
  div.playlist div.empty-queue(v-show="queueIsEmpty") span.grey-text Drop Movie
  files? Here ul.collection(ref="queue-list", v-show="!queueIsEmpty")
  li.collection-item(v-for="(queue, index) in queues", :class="{ selected: index
  === playPointer }", @click.prevent='play(index)')
  i.material-icons.playlist-deleter( @click.prevent='remove(index)') close
  span.truncate {{ queue.name }} li.clear-all div.clear-btn(@click="clear")
  i.material-icons clear span.clear-text Clear Playlist
  div.blue-grey.darken-2.center.video-controller
  button.btn.pause-btn(v-if="isPlaying", @click="pause")
  i.material-icons.white-text pause button.btn.play-btn(v-if="!isPlaying",
  @click="resume") i.material-icons.white-text play_arrow div.seekbar-container
  input.seekbar(type="range", id="seekbar", min="0", max="100",
  :value="currentTime", @input="inputCurrentTime") div.duration
  span.duration-text {{ videoRemaining }}
</template>
<script lang="ts">
const ipc = require("renderer/ipc");
const types = require("root/mutation-types");
const Sortable = require("sortablejs");

module.exports = {
  name: "FileController",
  computed: {
    queues() {
      return this.$store.state.video.queues;
    },
    playPointer() {
      return this.$store.state.video.playPointer;
    },
    queueIsEmpty() {
      return this.queues.length > 0 ? false : true;
    },
    video() {
      return this.$store.state.video.video;
    },
    isPlaying() {
      return this.video.isPlaying;
    },
    videoRemaining() {
      var remainSeconds = Math.floor(
        this.video.duration - this.video.currentTime
      );
      return `${Math.floor(remainSeconds / 60)}:${(
        "0" +
        (remainSeconds % 60)
      ).slice(-2)}`;
    },
    currentTime() {
      const percentage = (this.video.currentTime / this.video.duration) * 100;
      return isNaN(percentage) ? 0 : percentage;
    },
  },
  methods: {
    play(index) {
      ipc.commit(types.VIDEO_SELECT, { index: index });
    },
    resume() {
      ipc.commit(types.RESUME_FILE);
    },
    pause() {
      ipc.commit(types.PAUSE_FILE);
    },
    remove(index) {
      ipc.commit(types.REMOVE_QUEUE, { index: index });
    },
    clear() {
      ipc.commit(types.CLEAR_QUEUES);
    },
    inputCurrentTime(e) {
      ipc.commit(types.VIDEO_SEEK, { percentage: e.target.value });
    },
  },
  mounted() {
    Sortable.create(this.$refs["queue-list"], {
      onUpdate: function (e) {
        ipc.commit(types.SORT_QUEUE, {
          oldIndex: e.oldIndex,
          newIndex: e.newIndex,
        });
      },
    });
  },
};
</script>
<style lang="scss" scoped>

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
      color: #9e9e9e
  &.selected
    background: #22b4e2
    color: #fff
    .playlist-deleter
      color: #fff

.clear-all
  text-align: center
  padding: 20px 0 30px
  .clear-btn
    display: block
    margin: auto
    width: 100px
    color: #999
    cursor: pointer
    &:hover
      color: #666
  .clear-text,
  .material-icons
    display: block
  .material-icons
    font-size: 24px

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
  height: 210px
.video-controller
  position: absolute
  display: flex
  bottom: 0
  width: 100%
  height: 24px
  .play-btn,
  .pause-btn
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
  .duration
    width: 50px
    text-align: right
    padding: 0 6px 0 0
  .duration-text
    line-height: 24px
    white-space: nowrap
    color: #ccc
</style>
