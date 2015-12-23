var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: {
    "web": "./src/web.js"
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
        loaders: ['file']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel"
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
