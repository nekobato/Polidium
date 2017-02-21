const types = require('root/mutation-types')

module.exports = {
  state: {
    queues: [],
    playPointer: 0,
    controls: false,
    video: {
      duration: 0,
      currentTime: 0,
      seekPercentage: 0,
      isPlaying: false,
      switch: false // switch play/pause control by controller
    }
  },
  mutations: {
    [types.DROP_FILE] (state, payload) {
      state.queues.push(payload.file)
    },
    [types.PLAY_FILE] (state, payload) {
      state.playPointer = payload.index
      state.video.switch = true
    },
    [types.PAUSE_FILE] (state) {
      console.log("pause")
      state.video.switch = false
    },
    [types.RESUME_FILE] (state) {
      state.video.switch = true
    },
    [types.VIDEO_CANPLAY] (state, payload) {
      state.video.duration = payload.duration
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
    }
  }
}
