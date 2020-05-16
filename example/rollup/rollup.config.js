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
            items: ['./dist'],
            options: {}
          }
        },
        end: {
          zip: {
            items: [
              { source: './src/zip/a', destination: './dist/zip/a.tar', type: 'tar', options: {} },
              { source: './src/zip/b', destination: './dist/zip/b.zip', options: {} },
              { source: './src/zip/c', destination: './dist/zip/c.tgz', type: 'tgz', options: {} },
              { source: './src/zip/b.html', destination: './dist/zip/b.gz', type: 'gzip', options: {} }
            ],
            options: {}
          },
          copy: {
            items: [
              { source: './src/copy/a', destination: './dist/copy/a' },
              { source: './src/copy/b.html', destination: './dist/copy/b.html' }
            ],
            options: {}
          },
          rename: {
            items: [
              { path: './src', oldName: 'demo.js', newName: 'demo1.js' }
            ]
          },
          unzip: {
            items: [
              { source: './src/unzip/a.tar', destination: './dist/unzip/a', type: 'tar', options: {} },
              { source: './src/unzip/b.tgz', destination: './dist/unzip/b', type: 'tgz', options: {} },
              { source: './src/unzip/c.zip', destination: './dist/unzip/c', options: {} },
              { source: './src/unzip/d.gz', destination: './dist/unzip/d.html', type: 'gzip', options: {} }
            ],
            options: {}
          },
          move: {
            items: [
              { source: './src/move/a', destination: './dist/move/a' },
              // { source: './src/move', destination: './dist/move' },
            ],
            options: {}
          }
        }
      },
      customHooks: [
        {
          hookName: 'generateBundle', // rollup hooks: buildEnd | transform | load .....
          commands: {
            zip: {
              items: [
                { source: './src/zip/a', destination: './dist/zip/a.tar', type: 'tar', options: {} },
                { source: './src/zip/b', destination: './dist/zip/b.zip', options: {} },
                { source: './src/zip/c', destination: './dist/zip/c.tgz', type: 'tgz', options: {} },
                { source: './src/zip/b.html', destination: './dist/zip/b.gz', type: 'gzip', options: {} }
              ],
              options: {}
            },
          }
        },
        {
          hookName: 'buildEnd',
          commands: {
            rename: {
              items: [
                // { path: './src/rename', oldName: 'a', newName: 'b' }
              ]
            },
            copy: {
              items: [
                { source: './src/copy/a', destination: './dist/copy/a' },
                { source: './src/copy/b.html', destination: './dist/copy/b.html' }
              ],
              options: {}
            },
          }
        },
      ],
      options: {
        parallel: 4,
        // log: 'error', // error || all
        // cache: false,
        // progress: false
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