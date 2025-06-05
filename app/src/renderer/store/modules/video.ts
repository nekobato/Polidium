import { defineStore } from 'pinia'

function getQeueusFromLocalStrage () {
  return localStorage.queues ? JSON.parse(localStorage.queues) : []
}

export const useVideoStore = defineStore('video', {
  state: () => ({
    queues: getQeueusFromLocalStrage() as Array<{ name: string; path: string }>,
    playPointer: null as number | null,
    video: {
      duration: 0,
      currentTime: 0,
      seekPercentage: 0,
      isPlaying: false,
      switch: false // switch play/pause control by controller
    }
  }),
  actions: {
    dropFile (payload: { file: { name: string; path: string } }) {
      this.queues.push(payload.file)
      localStorage.setItem('queues', JSON.stringify(this.queues))
    },
    pauseFile () {
      this.video.switch = false
    },
    resumeFile () {
      this.video.switch = true
    },
    selectVideo (payload: { index: number }) {
      this.playPointer = payload.index
    },
    removeQueue (payload: { index: number }) {
      this.queues.splice(payload.index, 1)
      localStorage.setItem('queues', JSON.stringify(this.queues))
    },
    clearQueues () {
      this.queues = []
    },
    sortQueue (payload: { oldIndex: number; newIndex: number }) {
      const newRow = this.queues.splice(payload.newIndex, 1, null as any)[0]
      this.queues.splice(payload.newIndex, 1, this.queues[payload.oldIndex])
      this.queues.splice(payload.oldIndex, 1, newRow)
      localStorage.setItem('queues', JSON.stringify(this.queues))
    },
    videoCanplay (payload: { duration: number }) {
      this.video.duration = payload.duration
      this.video.switch = true
    },
    videoTimeupdate (payload: { currentTime: number }) {
      this.video.currentTime = payload.currentTime
    },
    videoSeek (payload: { percentage: number }) {
      this.video.seekPercentage = payload.percentage
    },
    videoPlayed () {
      this.video.isPlaying = true
      this.video.switch = true
    },
    videoPaused () {
      this.video.isPlaying = false
      this.video.switch = false
    },
    videoEnded () {
      if (this.queues[(this.playPointer ?? -1) + 1]) {
        this.playPointer = (this.playPointer ?? -1) + 1
      }
    }
  }
})
