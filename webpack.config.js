var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: "./index.js",
  output: {
      path: "dist",
      filename: "bundle.js"
  },
  module : {
    loaders: [ { 
        test   : /.js$/,
        loader : 'babel-loader?optional[]=runtime',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new WebpackNotifierPlugin(),
  ]
}