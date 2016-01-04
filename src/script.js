const remote = require('remote');
const path = require('path');
const Vue = require('vue');
const fs = require('fs');

const baseDir = process.cwd();

let files = fs.readdirSync('./');

console.log(files);
