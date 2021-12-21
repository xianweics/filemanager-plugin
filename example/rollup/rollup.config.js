import serve from "rollup-plugin-serve";
const filemanager = require("../../lib").RollupFilemanager;

export default {
  input: "./src/index.js",
  output: {
    file: "dist/index.js",
    name: "main",
    format: "umd"
  },
  watch: {
    include: "./src/**"
  },
  plugins: [
    filemanager({
      events: {
        start: {
          del: {
            items: ["./dist"]
          }
        },
        end: {
          move: {
            items: [
              {
                source: "./src/move/a",
                destination: "./dist/move/a"
              }
              // { source: './src/move', destination: './dist/move' },
            ]
          },
          rename: {
            items: [
              // {
              //   path: './src',
              //   oldName: 'demo.js',
              //   newName: 'demo1.js'
              // }
            ]
          },
          zip: {
            items: [
              {
                source: "./src/zip/a",
                destination: "./dist/zip/a.tar",
                type: "tar"
              },
              {
                source: "./src/zip/b",
                destination: "./dist/zip/b.zip"
              },
              {
                source: "./src/zip/c",
                destination: "./dist/zip/c.tgz",
                type: "tgz"
              },
              {
                source: "./src/zip/b.html",
                destination: "./dist/zip/b.gz",
                type: "gzip"
              }
            ]
          },
          unzip: {
            items: [
              {
                source: "./src/unzip/a.tar",
                destination: "./dist/unzip/a",
                type: "tar"
              },
              {
                source: "./src/unzip/b.tgz",
                destination: "./dist/unzip/b",
                type: "tgz"
              },
              {
                source: "./src/unzip/c.zip",
                destination: "./dist/unzip/c"
              },
              {
                source: "./src/unzip/d.gz",
                destination: "./dist/unzip/d.html",
                type: "gzip"
              }
            ]
          },
          copy: {
            items: [
              {
                source: "./src/copy/a",
                destination: "./dist/copy/a"
              },
              {
                source: "./src/copy/b.html",
                destination: "./dist/copy/b.html"
              }
            ]
          }
        }
      },
      customHooks: [
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
        // parallel: 4,
        // cache: true
        // log: 'error', // error || all
      }
    }),
    serve({
    
    })
  ]
};
