import os from 'os';
import cp from 'child_process';
import path from 'path';
import gulp from 'gulp';
import util from 'gulp-util';
import chalk from 'chalk';
import packager from 'electron-packager';
import ncp from 'ncp';
import gaze from 'gaze';
import del from 'del';
import run from 'run-sequence';
import replace from 'replace';
import webpack from 'webpack';
import get from 'lodash/object/get';
import defaults from 'lodash/object/defaults';
import {server} from 'electron-connect';
import {version} from './package.json';

/**
 * Environments and constants.
 */
const DEBUG = !(process.argv.includes('--release') || process.argv.includes('release'));
const WATCH = process.argv.includes('--watch') || process.argv.includes('watch');

defaults(process.env, {
  NODE_ENV: DEBUG ? 'development' : 'production',
  ELECTRON: '0.35.2',
  ARCHITECTURE: 'all',
});

switch (process.env.NODE_ENV) {
case 'production':
  defaults(process.env, {ENDPOINT: 'https://twitter.com'});
  break;
default:
  defaults(process.env, {ENDPOINT: 'http://twitter.com'});
  break;
}

util.log(chalk.green(`NODE_ENV:  ${process.env.NODE_ENV}`));
util.log(chalk.green(`ENDPOINT:  ${process.env.ENDPOINT}`));
util.log(chalk.green(`ELECTRON:  v${process.env.ELECTRON}`));

let electron;

/**
 * Helper functions.
 */
const copy = (source, destination) => new Promise((resolve, reject) => {
  ncp(source, destination, err => err ? reject(err) : resolve());
});

const exec = command => new Promise((resolve, reject) => {
  cp.exec(command, (err, stdout, stderr) => err ? reject(err) : resolve({stdout, stderr}));
});

const watch = pattern => new Promise((resolve, reject) => {
  gaze(pattern, (err, watcher) => err ? reject(err) : resolve(watcher));
});

const packaging = opts => new Promise((resolve, reject) => {
  packager(opts, (err, appPath) => err ? reject(err) : resolve(appPath));
});

/**
 * Packages the project from source files into an application.
 */
gulp.task('release', async () => {
  await del(['release/*', '!release/*.zip'], {dot: false});
  await new Promise(resolve => run('build', resolve));
  const appPaths = await packaging({
    dir: 'build',
    name: 'My Product',
    arch: 'x64',
    platform: process.env.ARCHITECTURE,
    version: process.env.ELECTRON,
    'app-bundle-id': 'production.myproduct',
    'app-version': version,
    asar: true,
    prune: true,
    overwrite: true,
    icon: './resource/icon',
    out: './release',
    cache: './tmp/cache',
  });
  if (os.platform() === 'darwin') {
    for (const index in appPaths) {
      if (appPaths.hasOwnProperty(index)) {
        const origin = appPaths[index];
        const target = `${origin}-v${version}.zip`;
        process.stdout.write(`Archiving app for platform ${origin.replace(/^.+-(.+?)-([^-]+?)$/, '$1 $2')}`);
        const start = Date.now();
        await exec(`ditto -ck --rsrc --sequesterRsrc "${origin}" "${target}"`);
        const osize = (await exec(`du -sh "${origin}" | cut -f1`)).stdout;
        const tsize = (await exec(`du -sh "${target}" | cut -f1`)).stdout;
        process.stdout.write(`  ${osize.trim()} -> ${tsize.trim()} (${Date.now() - start}ms)\n`);
      }
    }
  } else {
    util.log('Archiver only works in osx.');
  }
});

/**
 * Compiles the project from source files into a distributable format and copies it to the output (build) folder.
 */
gulp.task('build', async () => {
  await new Promise(resolve => run('clean', 'copy', 'bundle', resolve));
});

/**
 * Cleans up the output (build) directory.
 */
gulp.task('clean', async () => {
  await del(['build/*'], {dot: false});
});

/**
 * Copies static files to the output (build) folder.
 */
gulp.task('copy', async () => {
  await Promise.all([
    copy('src/resource', 'build/resource'),
    copy('src/main/index.html', 'build/index.html'),
    copy('package.json', 'build/package.json'),
  ]);

  replace({
    regex: '"main".*',
    replacement: '"main": "bundle.main.js",',
    paths: ['build/package.json'],
    recursive: false,
    silent: true,
  });

  if (WATCH) {
    const watcher = await watch('src/main/**/*.html');
    watcher.on('changed', async file => {
      util.log('[changed]', file);
      await copy(file, `build/${path.basename(file)}`);
      electron.reload();
    });
  }
});

/**
 * Bundles JavaScript into one or more packages ready to be used in a browser.
 */
gulp.task('bundle', async () => {
  const config = require('./webpack.config.babel');
  await new Promise((resolve, reject) => {
    let count = 0;
    const bundler = webpack(config);
    const bundle = (error, stats) => {
      if (error) {
        reject(new util.PluginError('bundle', error.message));
      } else {
        util.log(stats.toString(config[0].stats));
        if (++count === (WATCH ? config.length : 1)) {
          if (WATCH) {
            electron = server.create({path: 'build', electron: require('electron-prebuilt')});
            electron.start();
          }
          resolve();
        } else if (WATCH && count > config.length) {
          const info = stats.toJson(config[0].stats);
          if (/\.main\.js$/.test(get(info, 'assetsByChunkName.main'))) {
            electron.restart();
          } else {
            electron.reload();
          }
        }
      }
    };

    WATCH ? bundler.watch(200, bundle) : bundler.run(bundle);
  });
});
