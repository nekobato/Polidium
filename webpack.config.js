const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    "controller": "./src/controller/index.js",
    "player": "./src/player/index.js"
  },
  output: {
    path: "./app/js",
    publicPath: 'app',
    filename: '[name].js'
  },
  target: "electron-renderer",
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: path.join('../assets', '[name].[ext]?[hash]')
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'root': __dirname + '/src'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}
