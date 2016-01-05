export default {
  template: require('./template.jade'),
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
      if (/\.(ogg|wav|mp3|aac|m4a)$/.test(file.name)) {
        return "fa fa-music";
      } if (file.type === "directory") {
        return "fa fa-folder";
      }
    }
  },
  events: {
    'filer-set-dir': "setDir",
    'filer-get-dir': "getDir",
    'filer-add-depth': "addDepth",
  },
  methods: {
    toggleNav: function() {
      this.$els.nav.classList.toggle('show-mobile');
    },
    onSelectItem: function(file) {
      if (file.type === 'directory') {
        this.$emit('filer-get-dir', file);
      } else if (file.type === 'file') {
        this.$dispatch('dispatch-files', [file]);
      }
    },
    onSelectDepth: function(file, depth) {
      this.$data.depth.length = depth;
      this.$emit('filer-get-dir', file);
    },
    getDir: function(file) {
      this.$data.reaction.loadingDir = true;
      request.get('/api/path')
        .query({ path: file.path })
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) { throw err; }
          this.$emit('filer-set-dir', JSON.parse(res.text));
          this.addDepth(file);
          this.$data.reaction.loadingDir = false;
        });
    },
    setDir: function(files) {
      this.$set('filelist', files);
    },
    addDepth: function(file) {
      this.$data.depth.push(file);
    },
    addFilesAll: function() {
      this.$dispatch('dispatch-files', this.$data.filelist);
    }
  },
  ready: function() {
    this.getDir({ path: '/', name: '/' });
  }
}
