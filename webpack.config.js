var WebpackNotifierPlugin = require('webpack-notifier');
var webpack = require('webpack');

module.exports = {
  entry: {
    "script": "./src/script.js"
  },
  output: {
    path: "./",
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: ['', '.js']
  },
  target: "node",
  node: {
    __dirname: false,
  },
  module: {
    loaders: [
      {
        test: /\.(?:jpg|png|gif)$/,
        loader: "file"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.jade$/,
        loader: "jade"
      },
      {
        test: /\.styl$/,
        loader: "style!css!stylus"
      },
    ]
  },
  plugins: [
    new webpack.ExternalsPlugin('commonjs', ['electron', 'screen', 'remote']),
    new WebpackNotifierPlugin({title: 'Webpack'}),
  ],
  devtool: "#source-map",
  devServer: {
    contentBase: "./"
  }
}
