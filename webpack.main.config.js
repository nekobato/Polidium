const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    "main": "./app/src/main"
  },
  externals: Object.keys(require('./app/package.json').dependencies || {}),
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader'
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'app')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
    modules: [
      path.join(__dirname, 'app/node_modules')
    ],
    alias: {
      'main': path.join(__dirname, 'app/src/main'),
      'root': path.join(__dirname, 'app/src')
    }
  },
  target: 'electron-main'
}
