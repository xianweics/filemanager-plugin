const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const FileManagerPlugin = require('../../lib');
const Webpack = require('webpack');
const os = require('os');

const config = {
  entry: './src/index.js',
  output: {
    publicPath: '/',
    path: resolve(__dirname, 'dist'),
    filename: '[name].[hash:5].js'
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
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new FileManagerPlugin({
      events: {
        start: {
          del: {
            items: ['./dist'],
            options: {
              beforeRun: () => {},
              afterRun: () => {}
            }
          }
        },
        end: {
          zip: {
            items: [
              { source: './zip/a', destination: './dist/zip/a.tar', type: 'tar', options: {}},
              { source: './zip/b', destination: './dist/zip/b.zip', options: {}},
              { source: './zip/c', destination: './dist/zip/c.tgz', type: 'tgz', options: {}},
              { source: './zip/b.html', destination: './dist/zip/b.gz', type: 'gzip', options: {}}
            ],
            options: {
              beforeRun: () => {},
              afterRun: () => {}
            }
          },
          copy: {
            items: [
              { source: './copy/a', destination: './dist/copy/a' },
              { source: './copy/b.html', destination: './dist/copy/b.html' }
            ],
            options: {
              beforeRun: () => {},
              afterRun: () => {}
            }
          },
          rename: {
            items: [
              // { path: './rename', oldName: 'b', newName: 'a' }, // or
              // { path: './rename/b', newName: 'a' },
            ]
          },
          unzip: {
            items: [
              { source: './unzip/a.tar', destination: './dist/unzip/a', type: 'tar', options: {}},
              { source: './unzip/b.tgz', destination: './dist/unzip/b', type: 'tgz', options: {}},
              { source: './unzip/c.zip', destination: './dist/unzip/c', options: {}},
              { source: './unzip/d.gz', destination: './dist/unzip/d.html', type: 'gzip', options: {}}
            ],
            options: {
              beforeRun: () => {},
              afterRun: () => {}
            }
          },
          move: {
            items: [
              // { source: './move/a', destination: './dist/move/a' },
              // { source: './move/b.html', destination: './dist/move/b.html' },
            ],
            options: {
              beforeRun: () => {},
              afterRun: () => {}
            }
          }
        }
      },
      // customWebpackHooks: [
      //   {
      //     name: 'beforeRun',
      //     registerName: 'beforeRun', // default: REGISTER_beforeRun
      //     handler: (compilation, callback) => {
      //       console.info('I am beforeRun hook');
      //     }
      //   },
      //   {
      //     name: 'compile',
      //     handler: () => {
      //       console.info('I am compile hook');
      //     }
      //   }
      // ],
      options: {
        parallel: os.cpus().length * 2,
        logs: true
      }
    })
  ],
  devServer: {
    port: 9000,
    host: 'localhost',
    open: true,
    hot: true,
    inline: true,
    progress: true
  }
};

module.exports = config;