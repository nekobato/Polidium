const ipcRenderer = require('electron').ipcRenderer

import {
  PLAY_QUEUE,
  ADD_QUEUE,
  ADD_QUEUES,
  REMOVE_QUEUE,
  REMOVE_QUEUES,
  PLAY_PREV,
  PLAY_NEXT
} from '../mutation-types'

const state = {
  queues: []
}

const mutations = {

  [PLAY_QUEUE] (state, queue) {
    ipcRenderer.send('PLAY_FILE', JSON.stringify({
      name: queue.name,
      path: queue.path
    }))
  },
  [ADD_QUEUE] (state, file) {
    if (isMovieFile(file)) {
      state.queues.push(file)
    }
  },
  [ADD_QUEUES] (state, files) {
    console.log(files)
    for (let file of files) {
      if (isMovieFile(file)) {
        state.queues.push(file)
      }
    }
  },
  [REMOVE_QUEUE] (state, index) {
    state.queues.splice(index, 1)
  },
  [REMOVE_QUEUES] (state) {
    state.queues = []
  }
}

export default {
  state,
  mutations
}

// validate file
function isMovieFile (file) {
  if (/\.(mp4|mpe?g)$/.test(file.name)) {
    return true
  } else {
    return false
  }
}
