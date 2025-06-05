import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { ref, reactive } from 'vue'

export const useVideoStore = defineStore('video', () => {
  const queues = useStorage<Array<{ name: string; path: string }>>('queues', [])
  const playPointer = ref<number | null>(null)
  const video = reactive({
    duration: 0,
    currentTime: 0,
    seekPercentage: 0,
    isPlaying: false,
    switch: false // switch play/pause control by controller
  })

  function dropFile (payload: { file: { name: string; path: string } }) {
    queues.value.push(payload.file)
  }

  function pauseFile () {
    video.switch = false
  }

  function resumeFile () {
    video.switch = true
  }

  function selectVideo (payload: { index: number }) {
    playPointer.value = payload.index
  }

  function removeQueue (payload: { index: number }) {
    queues.value.splice(payload.index, 1)
  }

  function clearQueues () {
    queues.value = []
  }

  function sortQueue (payload: { oldIndex: number; newIndex: number }) {
    const newRow = queues.value.splice(payload.newIndex, 1, null as any)[0]
    queues.value.splice(payload.newIndex, 1, queues.value[payload.oldIndex])
    queues.value.splice(payload.oldIndex, 1, newRow)
  }

  function videoCanplay (payload: { duration: number }) {
    video.duration = payload.duration
    video.switch = true
  }

  function videoTimeupdate (payload: { currentTime: number }) {
    video.currentTime = payload.currentTime
  }

  function videoSeek (payload: { percentage: number }) {
    video.seekPercentage = payload.percentage
  }

  function videoPlayed () {
    video.isPlaying = true
    video.switch = true
  }

  function videoPaused () {
    video.isPlaying = false
    video.switch = false
  }

  function videoEnded () {
    if (queues.value[(playPointer.value ?? -1) + 1]) {
      playPointer.value = (playPointer.value ?? -1) + 1
    }
  }

  return {
    queues,
    playPointer,
    video,
    dropFile,
    pauseFile,
    resumeFile,
    selectVideo,
    removeQueue,
    clearQueues,
    sortQueue,
    videoCanplay,
    videoTimeupdate,
    videoSeek,
    videoPlayed,
    videoPaused,
    videoEnded
  }
})
