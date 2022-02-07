import { eslint } from "rollup-plugin-eslint";
import friendlyFormatter from "eslint-friendly-formatter";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: ["src/index.js", "src/workerCluster"],
  output: {
    dir: "lib",
    format: "cjs",
    exports: "named"
  },
  external: [
    "path",
    "os",
    "glob",
    "colors\/safe",
    "fs-extra",
    "cluster",
    "compressing",
    "glob-parent"
  ],
  watch: {
    include: "src/**"
  },
  plugins: [
    eslint({
      include: ["src/**"],
      formatter: friendlyFormatter,
      throwOnError: true,
      fix: true
    }),
    commonjs()
  ]
};
