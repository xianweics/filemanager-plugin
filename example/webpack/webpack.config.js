const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;
const Webpack = require('webpack');

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
            items: ['./dist']
          }
        },
        end: {
          zip: {
            items: [
              { source: './zip/a', destination: './dist/zip/a.tar', type: 'tar', options: {} },
              { source: './zip/b', destination: './dist/zip/b.zip', options: {} },
              { source: './zip/c', destination: './dist/zip/c.tgz', type: 'tgz', options: {} },
              { source: './zip/b.html', destination: './dist/zip/b.gz', type: 'gzip', options: {} }
            ]
          },
          copy: {
            items: [
              { source: './copy/a', destination: './dist/copy/a' },
              { source: './copy/b.html', destination: './dist/copy/b.html' }
            ]
          },
          rename: {
            items: [
              // { path: './rename', oldName: 'b', newName: 'a' }
            ]
          },
          unzip: {
            items: [
              { source: './unzip/a.tar', destination: './dist/unzip/a', type: 'tar', options: {} },
              { source: './unzip/b.tgz', destination: './dist/unzip/b', type: 'tgz', options: {} },
              { source: './unzip/c.zip', destination: './dist/unzip/c', options: {} },
              { source: './unzip/d.gz', destination: './dist/unzip/d.html', type: 'gzip', options: {} }
            ]
          },
          move: {
            items: [
              // { source: './move/a', destination: './dist/move/a' },
              // { source: './move/b.html', destination: './dist/move/b.html' },
            ]
          }
        }
      },
      // customHooks: [
      //   {
      //     hookType: 'tapAsync',
      //     hookName: 'beforeCompile',
      //     commands: {
      //       del: {
      //         items: ['./dist']
      //       },
      //       zip: {
      //         items: [
      //           {
      //             source: './zip/a',
      //             destination: './dist/zip/a.zip'
      //           },
      //           {
      //             source: './zip/c/index.html',
      //             destination: './dist/zip/c.index.html.tgz',
      //             type: 'tgz'
      //           },
      //           {
      //             source: './zip/b/index.html',
      //             destination: './dist/zip/b.html.gz',
      //             type: 'gzip'
      //           }
      //         ]
      //       },
      //       copy: {
      //         items: [
      //           {
      //             source: ['./copy/c', './copy/a'],
      //             destination: './dist/copy/'
      //           }
      //         ],
      //         options: {
      //           cache: false
      //         }
      //       }
      //     }
      //   },
      //   {
      //     hookName: 'done',
      //     hookType: 'tapAsync', // reference to webpack. tap | tapAsync | tapPromise
      //     commands: {
      //       // copy: {
      //       //   items: [
      //       //     {
      //       //       source: ['./copy/c', './copy/a'],
      //       //       destination: './dist/copy/'
      //       //     }
      //       //   ]
      //       // },
      //       // rename: {
      //       //   items: [
      //       //     { path: './rename', oldName: 'test.html', newName: 'test1.html' }
      //       //   ]
      //       // },
      //       move: {
      //         items: [
      //           {
      //             source: './move/**/*.html',
      //             destination: './dist'
      //           }
      //         ],
      //         options: {
      //           cache: false
      //         }
      //       },
      //       unzip: {
      //         items: [
      //           {
      //             source: './unzip/**/*.zip',
      //             destination: './dist/unzip/',
      //             type: 'zip'
      //           }
      //           // { source: './unzip/b.tgz', destination: './dist/unzip/b', type: 'tgz', options: {}},
      //           // { source: './unzip/c.zip', destination: './dist/unzip/c', options: {}},
      //           // { source: './unzip/d.gz', destination: './dist/unzip/d.html', type: 'gzip', options: {}}
      //         ]
      //       }
      //     }
      //   }
      // ],
      pluginLibraries: [
        {
          name: 'html-webpack-plugin',
          pluginOption: {
            filename: 'index.html',
            template: './src/index.html'
          }
        }
      ],
      options: {
        parallel: 4,
        cache: true
        // log: 'error', // error || all
      }
    })
  ],
  devServer: {
    port: 9000,
    host: 'localhost',
    open: false,
    hot: true,
    inline: true,
    progress: true
  }
};

module.exports = config;
