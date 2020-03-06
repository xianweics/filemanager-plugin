const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('path');
const FileManagerPlugin = require('../lib/index');

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
    new FileManagerPlugin({
      start: {},
      end: {
        copy: [
          { source: './cp1/index.html', destination: './dist/cp1/indeex.html' },
          // { source: './cp2', destination: './dist/cp2' }
        ],
        // zip: [
        //   { source: './cp2/', destination: './dist/cp2-compress.tar', type: 'tar' },
        //   { source: './cp2/index.html', destination: './dist/index-compress.zip' },
        //   { source: './cp3', destination: './dist/cp3-compress.tgz', type: 'tgz' },
        //   { source: './cp3/index.html', destination: './dist/index-gz.html.gz', type: 'gzip' }
        // ],
        // unzip: [
        //   { source: './dist/index-compress.zip', destination: './dist/index-compress.html' },
        //   { source: './dist/cp2-compress.tar', destination: './dist/cop2-uncompress', type: 'tar' },
        //   { source: './dist/cp3-compress.tgz', destination: './dist/cp3-uncompress', type: 'tgz' },
        //   { source: './dist/index-gz.html.gz', destination: './dist/index-gz.html', type: 'gzip' }
        // ],
        // move: [
        //   { source: './cp2', destination: './dist/cpp/dpp' },
        // ],
        // del: [
        //   { source: './del1/a' },
        //   { source: './del1/a.css' },
        //   { source: './del1/b/b.css' }
        // ],
      }
    })
  ]
};