import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { eslint } from "rollup-plugin-eslint";
import friendlyFormatter from "eslint-friendly-formatter";

export default {
  input: ['src/index.js', 'src/workerCluster.js'],
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].js'
  },
  external: [
    'fs',
    'path',
    'os',
    'glob',
    'util',
    'colors',
    'fs-extra',
    'cluster',
    'cli-progress',
    'compressing'],
  watch: {
    include: 'src/**'
  },
  plugins: [
    eslint({
      include: ['src/**'],
      formatter: friendlyFormatter,
      throwOnError: true,
      fix: true
    }),
    resolve({
      mainFields: ['jsnext', 'module', 'main']
    }),
    json(),
    babel({
      babelHelpers: 'runtime',
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }),
    commonjs()
  ]
};
