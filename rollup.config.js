import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    commonjs()
  ]
};