const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const remote      = electron.remote
const fs = remote.require('fs')
const path = remote.require('path')
import style from './style.styl'

export default {
  template: require('./template.jade')(),
  data: function() {
    return {
      depth: [],
      current: {},
      filelist: [],
      reaction: {
        loadingDir: false
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
  events: {
    'filer-set-dir': "setDir",
    'getDir': "getDir",
    'filer-add-depth': "addDepth",
  },
  methods: {
    selectItem: function(file) {
      if (file.type === 'directory') {
        this.$emit('getDir', file)
      } else if (file.type === 'file') {
        ipcRenderer.send('controller:ipc-bridge', 'filer:select-file', JSON.stringify(file))
      }
    },
    onSelectDepth: function(file, depth) {
      this.$data.depth.length = depth
      this.$emit('getDir', file)
    },
    getDir: function(file) {
      this.$data.reaction.loadingDir = true

      if (fs.statSync(file.path).isDirectory()) {
        let finder = []
        for(var p of fs.readdirSync(file.path)) {
          if (/^\..*/.test(p)) { continue }
          let stats = fs.statSync(path.join(file.path, p))
          finder.push({
            name: p,
            path: path.join(file.path, p),
            type: stats.isDirectory() ? 'directory' : 'file'
          })
        }

        this.$emit('filer-set-dir', finder)
        this.addDepth(file)
        this.$data.reaction.loadingDir = false
      }
    },
    setDir: function(files) {
      this.$set('filelist', files)
      window.localStorage.setItem('depth', JSON.stringify(this.$data.depth))
    },
    addDepth: function(file) {
      this.$data.depth.push(file)
    },
    addFilesAll: function() {
      this.$dispatch('all', 'files:get', this.$data.filelist)
    }
  },
  ready: function() {
    const depth = JSON.parse(window.localStorage.depth) || []
    // Resurrect
    if (depth.length) {
        const currentDir = depth[depth.length-1]
        this.$data.depth = depth
        this.getDir(currentDir)
    } else {
      this.getDir({ path: '/', name: '/' })
    }
  }
}
