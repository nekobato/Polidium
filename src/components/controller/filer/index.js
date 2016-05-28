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
      this.updateDepth()
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
    },
    addDepth: function(file) {
      this.$data.depth.push(file)
      this.updateDepth()
    },
    updateDepth: function() {
      window.localStorage.setItem('depth', JSON.stringify(this.$data.depth))
      console.log(window.localStorage.depth)
    },
    addFilesAll: function() {
      this.$dispatch('all', 'files:get', this.$data.filelist)
    }
  },
  created: function() {
    // Resurrect
    console.log(window.localStorage.depth)
    let depth = JSON.parse(window.localStorage.depth) || [{ path: '/Users', name: '/' }]
    console.log(depth)
    const currentDir = depth.pop()
    console.log(depth)
    this.$data.depth = depth
    this.getDir(currentDir)
  }
}
