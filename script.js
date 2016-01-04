const remote = require('remote');
const path = require('path');
const Vue = require('vue');
const fs = require('fs');

const baseDir = process.cwd();


Vue.config.silent = true

new Vue({
  data: {
    files: null
  },
  el: "#polidium",
  ready: function() {
    var files = fs.readdirSync('./');
    this.files = files;
    console.log(files);
  }
});
