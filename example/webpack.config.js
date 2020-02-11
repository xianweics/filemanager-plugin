const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('path');
const FileMangerPlugin = require('../lib/index');

module.exports = {
  entry: './index.js',
  mode: 'production',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[hash:5].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        removeEmptyAttributes: true
      }
    }),
    new FileMangerPlugin({
      start: {},
      end: {
        copy: [
          { source: './cp1', destination: './dist/cp1' },
          { source: './cp2', destination: './dist/cp2' }
        ]
      }
    })
  ]
};