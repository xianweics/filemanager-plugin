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
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
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
        // copy: [
        //   { source: './cp1', destination: './dist/cp1' },
        //   { source: './cp2', destination: './dist/cp2' }
        // ],
        compress: [
          { source: './cp2/', destination: './dist/cp2-compress.tar', type: 'tar' },
          { source: './cp2/index.html', destination: './dist/index-compress.html.zip' },
          { source: './cp3', destination: './dist/cp3-compress.gz', type: 'gzip' }
        ],
        del: [
          './cp2/cp-back'
        ],
        uncompress: [
          { source: './dist/index-compress.html.zip', destination: './dist/index-compress.html' },
          { source: './dist/cp2-compress.tar', destination: './dist/cop2-uncompress', type: 'tar' },
          { source: './dist/cp3-compress.gz', destination: './dist/cp3-uncompress', type: 'gzip' }
        ]
      }
    })
  ]
};