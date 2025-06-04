import * as types from 'root/mutation-types'

function getQeueusFromLocalStrage () {
  return localStorage.queues ? JSON.parse(localStorage.queues) : []
}

const saveQueues = function () {
  localStorage.setItem('queues', JSON.stringify(state.queues))
}

const state = {
  queues: getQeueusFromLocalStrage(),
  playPointer: null,
  video: {
    duration: 0,
    currentTime: 0,
    seekPercentage: 0,
    isPlaying: false,
    switch: false // switch play/pause control by controller
  }
}

export default {
  state,
  mutations: {
    [types.DROP_FILE] (state, payload) {
      state.queues.push(payload.file)
      saveQueues()
    },
    [types.PAUSE_FILE] (state) {
      state.video.switch = false
    },
    [types.RESUME_FILE] (state) {
      state.video.switch = true
    },
    [types.VIDEO_SELECT] (state, payload) {
      state.playPointer = payload.index
    },
    [types.REMOVE_QUEUE] (state, payload) {
      state.queues.splice(payload.index, 1)
      saveQueues()
    },
    [types.CLEAR_QUEUES] (state) {
      state.queues = []
    },
    [types.SORT_QUEUE] (state, payload) {
      const newRow = state.queues.splice(payload.newIndex, 1, null)[0]
      state.queues.splice(payload.newIndex, 1, state.queues[payload.oldIndex])
      state.queues.splice(payload.oldIndex, 1, newRow)
      saveQueues()
    },
    [types.VIDEO_CANPLAY] (state, payload) {
      state.video.duration = payload.duration
      state.video.switch = true
    },
    [types.VIDEO_TIMEUPDATE] (state, payload) {
      state.video.currentTime = payload.currentTime
    },
    [types.VIDEO_SEEK] (state, payload) {
      state.video.seekPercentage = payload.percentage
    },
    [types.VIDEO_PLAYED] (state) {
      state.video.isPlaying = true
      state.video.switch = true
    },
    [types.VIDEO_PAUSED] (state) {
      state.video.isPlaying = false
      state.video.switch = false
    },
    [types.VIDEO_ENDED] (state) {
      if (state.queues[state.playPointer + 1]) {
        state.playPointer += 1
      }
    }
  }
}
