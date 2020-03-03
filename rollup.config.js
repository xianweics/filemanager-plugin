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
  external: ['fs'],
  plugins: [
    resolve(),
    json(),
    babel({
      runtimeHelpers: true
    }),
    commonjs()
  ]
};