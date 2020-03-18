import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

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
    resolve({
      mainFields: ['jsnext', 'module', 'main']
    }),
    json(),
    babel({ runtimeHelpers: true }),
    commonjs()
  ]
};