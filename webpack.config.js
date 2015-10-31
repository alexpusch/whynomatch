var WebpackNotifierPlugin = require('webpack-notifier');
var path = require("path");
module.exports = {
  entry: {
    app: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "index.js",
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
  ]
}