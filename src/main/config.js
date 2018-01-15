module.exports = {
  development: {
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
