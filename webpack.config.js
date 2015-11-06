var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  target: "node",
  entry: "./src/whynomatch.js",
  output: {
      path: "dist",
      filename: "whynomatch.js",
      library: "whynomatch",
      libraryTarget: "umd"
  },
  module : {
    loaders: [ { 
        test   : /.js$/,
        loader : 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new WebpackNotifierPlugin(),
  ],
  externals: {
    'lodash': {
      root: '_',
      commonjs2: 'lodash',
      commonjs: 'lodash',
      amd: 'lodash'
    }
  }
}