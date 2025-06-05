<template>
  <div class="playlist">
    <div class="empty-queue" v-show="queueIsEmpty">
      <span class="grey-text">Drop Movie files? Here</span>
    </div>
    <ul class="collection" ref="queueList" v-show="!queueIsEmpty">
      <li
        class="collection-item"
        v-for="(queue, index) in queues"
        :key="index"
        :class="{ selected: index === playPointer }"
        @click.prevent="play(index)"
      >
        <i class="material-icons playlist-deleter" @click.prevent="remove(index)">close</i>
        <span class="truncate">{{ queue.name }}</span>
      </li>
      <li class="clear-all">
        <div class="clear-btn" @click="clear">
          <i class="material-icons">clear</i>
          <span class="clear-text">Clear Playlist</span>
        </div>
      </li>
    </ul>
    <div class="blue-grey darken-2 center video-controller">
      <button class="btn pause-btn" v-if="isPlaying" @click="pause">
        <i class="material-icons white-text">pause</i>
      </button>
      <button class="btn play-btn" v-if="!isPlaying" @click="resume">
        <i class="material-icons white-text">play_arrow</i>
      </button>
      <div class="seekbar-container">
        <el-slider
          class="seekbar"
          id="seekbar"
          :min="0"
          :max="100"
          :model-value="currentTime"
          @input="inputCurrentTime"
        />
      </div>
      <div class="duration">
        <span class="duration-text">{{ videoRemaining }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVideoStore } from 'renderer/store/modules/video'
import ipc from 'renderer/ipc'
import * as types from 'root/mutation-types'
import Sortable, { type SortableEvent } from 'sortablejs'

const videoStore = useVideoStore()
const queueList = ref<HTMLElement | null>(null)

const queues = computed(() => videoStore.queues)
const playPointer = computed(() => videoStore.playPointer)
const queueIsEmpty = computed(() => queues.value.length === 0)
const video = computed(() => videoStore.video)
const isPlaying = computed(() => video.value.isPlaying)
const videoRemaining = computed(() => {
  const remainSeconds = Math.floor(video.value.duration - video.value.currentTime)
  return `${Math.floor(remainSeconds / 60)}:${('0' + (remainSeconds % 60)).slice(-2)}`
})
const currentTime = computed(() => {
  const percentage = (video.value.currentTime / video.value.duration) * 100
  return isNaN(percentage) ? 0 : percentage
})

function play (index: number) {
  ipc.commit(types.VIDEO_SELECT, { index })
}

function resume () {
  ipc.commit(types.RESUME_FILE, {})
}

function pause () {
  ipc.commit(types.PAUSE_FILE, {})
}

function remove (index: number) {
  ipc.commit(types.REMOVE_QUEUE, { index })
}

function clear () {
  ipc.commit(types.CLEAR_QUEUES, {})
}

function inputCurrentTime (value: number) {
  ipc.commit(types.VIDEO_SEEK, { percentage: value })
}

onMounted(() => {
  Sortable.create(queueList.value!, {
    onUpdate: (e: SortableEvent) => {
      ipc.commit(types.SORT_QUEUE, {
        oldIndex: e.oldIndex,
        newIndex: e.newIndex
      })
    }
  })
})
</script>

<style lang="scss" scoped>
.play-controller {
  text-align: center;
}
.collection {
  width: 100%;
}
.playlist-deleter {
  right: 5px;
  display: none;
  position: absolute;
}
.collection-item {
  position: relative;
  cursor: pointer;
}
.collection-item:hover .playlist-deleter {
  display: inline-block;
  color: #9e9e9e;
}
.collection-item.selected {
  background: #22b4e2;
  color: #fff;
}
.collection-item.selected .playlist-deleter {
  color: #fff;
}
.clear-all {
  text-align: center;
  padding: 20px 0 30px;
}
.clear-all .clear-btn {
  display: block;
  margin: auto;
  width: 100px;
  color: #999;
  cursor: pointer;
}
.clear-all .clear-btn:hover {
  color: #666;
}
.clear-all .clear-text,
.clear-all .material-icons {
  display: block;
}
.clear-all .material-icons {
  font-size: 24px;
}
.playlist {
  margin: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow-y: scroll;
}
.empty-queue {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  border: 2px dotted #ccc;
  border-radius: 5px;
  width: 280px;
  height: 210px;
}
.video-controller {
  position: absolute;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 24px;
}
.video-controller .play-btn,
.video-controller .pause-btn {
  display: inline-block;
  padding: 0 1rem;
  height: 24px;
  line-height: 24px;
  vertical-align: top;
}
.video-controller .seekbar-container {
  flex-grow: 1;
  display: inline-block;
  padding: 0 10px;
  line-height: 18px;
}
.video-controller .seekbar {
  border: 0;
  border-radius: 2px;
  margin: 0;
}
.video-controller .duration {
  width: 50px;
  text-align: right;
  padding: 0 6px 0 0;
}
.video-controller .duration-text {
  line-height: 24px;
  white-space: nowrap;
  color: #ccc;
}
</style>

