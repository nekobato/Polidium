path = require('path');
gulp = require('gulp');
util = require('gulp-util');
packager = require('electron-packager');
appPackage = require('./app/package.json');

const buildOption = {
  arch: 'x64', // ia32, x64, all
  dir: './app',
  platform: 'darwin', // linux, win32, darwin, all
  // below is optional
  name: 'Polidium',
  version: process.env.ELECTRON || '1.2.0',
  'app-bundle-id': `${appPackage.author}.${appPackage.name}`,
  'app-version': appPackage.version,
  asar: true,
  prune: true,
  overwrite: true,
  icon: './Polidium',
  out: './release',
  ignore: /\*\.map/
}

gulp.task('release', () => {
  var start = Date.now();

  packager(buildOption, (err, appPath) => {
    if (err) console.log('[ERROR]', err);
    console.log('[appPath]', appPath);
    var end = Date.now();

    console.log('[relase]', `${end  - start} MilliSeconds.`);
  });
});
