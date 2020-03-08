const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      start: {
        del: [
          { source: './dist' }
        ]
      },
      end: {
        zip: [
          { source: './zip/a', destination: './dist/zip/a.tar', type: 'tar' },
          { source: './zip/b', destination: './dist/zip/b.zip' },
          { source: './zip/c', destination: './dist/zip/c.tgz', type: 'tgz' },
          { source: './zip/b.html', destination: './dist/zip/b.gz', type: 'gzip' }
        ],
        copy: [
          { source: './copy/a', destination: './dist/copy/a' },
          { source: './copy/b.html', destination: './dist/copy/b.html' }
        ],
        rename: [
          { source: './rename/b', destination: './rename/a' },
        ],
        unzip: [
          { source: './unzip/a.tar', destination: './dist/unzip/a', type: 'tar' },
          { source: './unzip/b.tgz', destination: './dist/unzip/b', type: 'tgz' },
          { source: './unzip/c.zip', destination: './dist/unzip/c' },
          { source: './unzip/d.gz', destination: './dist/unzip/d.html', type: 'gzip' }
        ],
        move: [
          { source: './move/a', destination: './dist/move/a' },
          { source: './move/b.html', destination: './dist/move/b.html' },
        ],
        del: [
          { source: './del/a' },
          { source: './del/b.html' }
        ]
      }
    })
  ]
};