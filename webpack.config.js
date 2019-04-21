const webpack = require('webpack')
const path = require('path')
module.exports = {
  entry: path.join(__dirname, '/app/main.js'), // 已多次提及的唯一入口文件
  output: {
    path: path.join(__dirname, '/public'), // 打包后的文件存放的地方
    filename: 'index.js' // 打包后输出文件的文件名 [chunkhash]
  },
  mode: 'development', // production，development
  devtool: 'cheap-module-source-map', //cheap-module-eval-source-map,eval-source-map,cheap-module-source-map,source-map
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
