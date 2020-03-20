import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const rollupFilemanager = require('../../lib').rollupFilemanager;

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
    rollupFilemanager('this is a msg'),
    resolve({
      mainFields: ['jsnext', 'module', 'main']
    }),
    json(),
    babel({ runtimeHelpers: true }),
    commonjs()
  ]
};