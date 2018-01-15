'use strict'

export default {
  isDev: process.env.NODE_ENV === 'development',
  isMac: process.platform === 'darwin'
}
