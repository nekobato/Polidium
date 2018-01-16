'use strict'

module.exports = {
  development: {
    winURL: 'http://localhost:9080',
    controller: {
      size: {
        width: 320,
        height: 320
      }
    },
    player: {
      size: {
        width: 400,
        height: 300
      }
    }
  },
  production: {
    winURL: `file://${__dirname}/index.html`,
    controller: {
      size: {
        width: 320,
        height: 320
      }
    },
    player: {
      size: {} // workAreaSize
    }
  }
}
