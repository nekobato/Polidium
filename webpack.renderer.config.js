const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    "controller": "./app/src/renderer/controller",
    "player": "./app/src/renderer/player"
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'renderer': path.join(__dirname, 'app/src/renderer'),
      'root': path.join(__dirname, 'app/src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#source-map'
}
