var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: {
    "controller": "./src/controller.js"
  },
  output: {
    path: "./app",
    filename: "[name].js",
    publicPath: "/"
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
    new WebpackNotifierPlugin({title: 'Webpack'}),
  ],
  devtool: "#source-map",
  devServer: {
    contentBase: "./"
  }
}
