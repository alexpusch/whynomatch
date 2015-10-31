var WebpackNotifierPlugin = require('webpack-notifier');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
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
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader")
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
      }
    ]
  },
  sassLoader: {
    indentedSyntax: true
  },
  plugins: [
    new WebpackNotifierPlugin(),
    new ExtractTextPlugin("index.css")
  ],
  externals: {
    "jquery": "jQuery"
  }
}