import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const rollupFilemanager = require('../../lib').RollupFilemanager;

export default {
  input: './src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  watch: {
    include: './src/**'
  },
  plugins: [
    rollupFilemanager({
      events: {
        start: {
          del: {
            items: ['./dist']
          }
        },
        end: {
          zip: {
            items: [
              {
                source: './src/zip/a',
                destination: './dist/zip/a.tar',
                type: 'tar'
              },
              {
                source: './src/zip/b',
                destination: './dist/zip/b.zip'
              },
              {
                source: './src/zip/c',
                destination: './dist/zip/c.tgz',
                type: 'tgz'
              },
              {
                source: './src/zip/b.html',
                destination: './dist/zip/b.gz',
                type: 'gzip'
              }
            ]
          },
          copy: {
            items: [
              {
                source: './src/copy/a',
                destination: './dist/copy/a'
              },
              {
                source: './src/copy/b.html',
                destination: './dist/copy/b.html'
              }
            ]
          },
          rename: {
            items: [
              {
                path: './src',
                oldName: 'demo.js',
                newName: 'demo1.js'
              }
            ]
          },
          unzip: {
            items: [
              {
                source: './src/unzip/a.tar',
                destination: './dist/unzip/a',
                type: 'tar'
              },
              {
                source: './src/unzip/b.tgz',
                destination: './dist/unzip/b',
                type: 'tgz'
              },
              {
                source: './src/unzip/c.zip',
                destination: './dist/unzip/c'
              },
              {
                source: './src/unzip/d.gz',
                destination: './dist/unzip/d.html',
                type: 'gzip'
              }
            ]
          },
          move: {
            items: [
              {
                source: './src/move/a',
                destination: './dist/move/a'
              }
              // { source: './src/move', destination: './dist/move' },
            ]
          }
        }
      },
      customHooks: [
        {
          hookName: 'generateBundle',
          commands: {
            rename: {
              items: [
                // { path: './src/rename', oldName: 'a', newName: 'b' }
              ]
            },
            copy: {
              items: [
                {
                  source: './src/copy/a',
                  destination: './dist/copy/a'
                },
                {
                  source: './src/copy/b.html',
                  destination: './dist/copy/b.html'
                }
              ]
            }
          }
        },
        {
          hookName: 'buildStart', // rollup hooks: buildEnd | transform | load .....
          commands: {
            del: {
              items: ['./dist']
            },
            zip: {
              items: [
                {
                  source: './src/zip/a',
                  destination: './dist/zip/a.tar',
                  type: 'tar'
                },
                {
                  source: './src/zip/b',
                  destination: './dist/zip/b.zip'
                },
                {
                  source: './src/zip/c',
                  destination: './dist/zip/c.tgz',
                  type: 'tgz'
                },
                {
                  source: './src/zip/b.html',
                  destination: './dist/zip/b.gz',
                  type: 'gzip'
                }
              ]
            }
          }
        },
      ],
      options: {
        parallel: 4,
        cache: true
        // log: 'error', // error || all
      }
    }),
    resolve({
      mainFields: ['jsnext', 'module', 'main']
    }),
    json(),
    babel({ runtimeHelpers: true }),
    commonjs()
  ]
};
