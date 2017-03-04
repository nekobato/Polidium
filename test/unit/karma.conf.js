'use strict'

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

const baseConfig = require('../../webpack.config')
const projectRoot = path.resolve(__dirname, '../../')

let webpackConfig = merge(baseConfig, {
  // module: {
  //   rules: [
  //     {
  //       test: /\.vue$/,
  //       loader: 'vue-loader'
  //       options: {
  //         loaders: {
  //           js: 'isparta'
  //         }
  //       }
  //     }
  //   ]
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"'
    })
  ]
})

delete webpackConfig.entry

// // make sure isparta loader is applied
// webpackConfig.module.preLoaders = webpackConfig.module.preLoaders || []
// webpackConfig.module.preLoaders.unshift({
//   test: /\.js$/,
//   loader: 'isparta',
//   include: path.resolve(projectRoot, 'src')
// })

module.exports = config => {
  config.set({
    browsers: ['visibleElectron'],
    client: {
      useIframe: false
    },
    colors: true,
    // coverageReporter: {
    //   dir: './coverage',
    //   reporters: [
    //     { type: 'lcov', subdir: '.' },
    //     { type: 'text-summary' }
    //   ]
    // },
    customLaunchers: {
      'visibleElectron': {
        base: 'Electron',
        flags: ['--show']
      }
    },
    frameworks: ['jasmine'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    // reporters: ['spec', 'coverage'],
    reporters: ['spec'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      require("karma-jasmine"),
      require("karma-webpack"),
      require("karma-electron"),
      require("karma-sourcemap-loader"),
      require("karma-spec-reporter")
    ]
  })
}
