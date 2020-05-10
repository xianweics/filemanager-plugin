# File manager plugin

[![Build Status](https://travis-ci.org/xianweics/filemanager-plugin.svg?branch=master)](https://travis-ci.org/xianweics/filemanager-plugin)
[![Coverage Status](https://coveralls.io/repos/github/xianweics/filemanager-plugin/badge.svg)](https://coveralls.io/github/xianweics/filemanager-plugin)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/xianweics/filemanager-plugin/blob/master/LICENSE)

# Overview

This filemanager plugin allows you to delete, zip/unzip(.zip/.tar/.tar.gz), move, rename, copy files or directories
 before and after webpack/rollup builds. Also, you can customize the lifecycle of **webpack** or **rollup** during
  building.

# Installation
`npm install filemanager-plugin --save-dev`

# Usage

## events

> Control the running order during building.

- `start {Object}`: Register actions to [`beforeRun`](https://webpack.js.org/api/compiler-hooks/#beforeRun) hook to compiler, actions which you set will be run before running the compiler.
- `end {Object}`: Register actions to [`done`](https://webpack.js.org/api/compiler-hooks/#done) hook to compiler, actions will be executed when the compilation has completed.

In the example below, the start event with `del` command will run first, 
and then the end event with `zip` after.

```javascript
// webpack
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;
module.exports = {
  plugins: [
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
              {source: './src/demo0.zip', destination: './dest/demo0', type: 'zip'}
            ]   
          }
        }
      }
    })
  ]
};

// rollup
const rollupFilemanager = require('filemanager-plugin').RollupFilemanager;
module.exports = {
  plugins: [
    rollupFilemanager({
      events: {} // It's the same as webpack configuration
    })
  ]
}
```

## customHooks

> Supports for custom lifecycle for webpack or rollup to control the running order.
> In addition, **when `customHooks` is set, `events` will be ignored.**

- `hookName {String}`: Register hook of webpack or rollup. Commands will run when each hook is called. [webpack hooks](https://webpack.js.org/api/compiler-hooks/). [rollup hooks](https://github.com/rollup/rollup/blob/master/docs/05-plugin-development.md).
- `commands {Array}`: Setting actions. Commands will run, when each hook which you registered is triggered.
- `hookType {String}`: Depending on the hook type, It only supports **webpack**.

```javascript
// webpack
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;
module.exports = {
  plugins: [
    new FileManagerPlugin({
      events: {
        start: {
          zip: {
            items: [
              {source: './src/demo0.zip', destination: './dest/demo0', type: 'zip'}
            ]   
          }
        }
      }, // events will be ignore.
      customHooks: [
        {
          hookName: 'compile',
          hookType: 'tap',
          commands: {
            del: {
              items: ['./dist']
              // All file under './dist' will be deleted, when compile hook is called
            }
          }
        }
      ]
    })
  ]
};

// rollup
const RollupFilemanager = require('filemanager-plugin').RollupFilemanager;
module.exports = {
  plugins: [
    new RollupFilemanager({
      customHooks: [
        {
          hookName: 'generateBundle',
          commands: {
            del: {
              items: ['./dist']
              // All file under './dist' will be deleted, when generateBundle hook is called
            }
          }
        }
      ]
    })
  ]
};
```

## Commands

|  Name   | Type  |  Description |
|  :---   | :---  |      ---     |
| `zip`    | `{Array}` | Zip files or directories by using `tar`, `tgz`, `gzip` or `zip`. However, `gzip` only supports compress single file. You need to use `tgz` to zip a directory. |
| `unzip`  | `{Array}` | Unzip files or directories. The usage is Same as `zip`. |
| `del`    | `{Array}` | Delete multiple files or directories. |
| `copy`   | `{Array}` | Copy multiple files or directories. |
| `move`   | `{Array}` | Move multiple files or directories. |
| `rename` | `{Array}` | Rename multiple files or directories. |

These commands would be called when each hook which has been registered is called.
Also, each action will be executed in order base on `Array` order.
In this example below, in the end event, the `del` command will run first, and `zip` after:

```javascript
// webpack
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;
module.exports = {
  plugins: [
    new FileManagerPlugin({
      events: {
        start: {
          del: {
            items: ['./dist']
          },
          zip: {
            items: [
              {source: './src/demo0.zip', destination: './dest/demo0', type: 'zip'}
            ]   
          }
        }
      }
    })
  ]
};

// rollup
const rollupFilemanager = require('filemanager-plugin').RollupFilemanager;
module.exports = {
  plugins: [
    rollupFilemanager({
      events: {} // It's the same as webpack configuration
    })
  ]
}
```

#### `zip` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      events: {
        end: {
          zip: {
            items: [
               { source: './src/demo1', destination: './dest/demo1.zip', type: 'zip'},
               { source: './src/demo2', destination: './dest/demo2.tar', type: 'tar'},
               { source: './src/demo3', destination: './dest/demo3.tgz', type: 'tgz'},
               { source: './src/demo4.html', destination: './dest/demo4.html.gz', type: 'gzip'},
               { source: './src/*.js', destination: './dest/demo5.js.zip'} 
               // All js files under './src' will be compressed to 'demo5.js.zip' under './dest'
            ]
          }
        }
      }
    })
  ]
}
```
- `source {String}`: Compressed source path which can be a file or directory. It supports [glob pattern](https://github.com/isaacs/node-glob). 
- `destination {String}`: Compressed destination path.
- `type {String}`: Compressed type. Default is `zip`.

#### `unzip` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      events: {
        end: {
          unzip: {
            items: [
              { source: './src/demo1.zip', destination: './dest/demo1'},
              { source: './src/demo2.tar', destination: './dest/demo2', type: 'tar'},
              { source: './src/demo3.tgz', destination: './dest/demo3', type: 'tgz'},
              { source: './src/demo4.html.gz', destination: './dest/demo4', type: 'gzip'},
              { source: './src/*.zip', destination: './dest/demo5'}
              // All zip files under './src' will be uncompressed to 'demo5' under './dest'
            ]
          }
        }      
      }
    })
  ]
}
```

- `source {String}`: Uncompressed source path. It supports [glob pattern](https://github.com/isaacs/node-glob). 
- `destination {String}`: Uncompressed destination path.
- `type {String}`: Uncompressed type. Default is `zip`.

#### `del` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      events: {
        end: {
          del: {
            items: [
              './dist',
              './temp/*.html' // All html files under './temp' will be deleted.
            ]  
          }
        }
      }
    })
  ]
}
```

- `source {String}`: Deleted path which can be a file or directory. It supports [glob pattern](https://github.com/isaacs/node-glob). 

#### `copy` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        copy: {
          items: [
            { source: './src/demo1', destination: './dest/demo'},
            { source: './src/demo/*.html', destination: './dest/demo'}
            // All html files under './src/demo' will be copied to './dest/demo'
          ]
        }
      }
    })
  ]
}
```

- `source {String}`: Copied source path. It supports [glob pattern](https://github.com/isaacs/node-glob). 
- `destination {String}`: Copied destination path.

#### `move` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        move: {
          items: [
            { source: './src/demo1.zip', destination: './dest/demo1'},
            { source: './src/*.css', destination: './dest/demo'}
            // All css files under './src' will be moved to './dest/demo'
          ] 
        }       
      }
    })
  ]
}
```

- `source {String}`: Moved source path. It supports [glob pattern](https://github.com/isaacs/node-glob).
- `destination {String}`: Moved destination path.

#### `rename` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        rename: {
          items : [
            { path: './rename', oldName: 'a.html', newName: 'b.html' }
          ]
        }
      }
    })
  ]
}
```

- `source {String}`: Renamed source path.
- `destination {String}`: Renamed destination path.

# Upgrade

```javascript
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;

// webpack 1.X.X
module.exports = {
  plugins: [
    new FileManagerPlugin({
      start: {
        del: [
          { source: './dist' }
        ]
      },
      end: {
        zip: [
          { source: './src/demo', destination: './dest/demo.zip', type: 'zip'}
        ],
        rename: [
          { source: './rename/b', destination: './rename/a' }
        ],   
        copy: [
          { source: './src/demo', destination: './dest/demo'}
        ],
        unzip: [
        ],
        move: [
          { source: './src/demo.zip', destination: './dest/demo.zip'}
        ]
      }
    })
  ]
};

// webpack 2.X.X
module.exports = {
  plugins: [
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
              { source: './src/demo', destination: './dest/demo.zip', type: 'zip'}
            ]
          },
          rename: {
            items: [
              { path: './rename', oldName: 'b', newName: 'a' }
            ]
          },
          copy: {
            items: [
              { source: './src/demo', destination: './dest/demo'}
            ]
          },
          unzip: {
            items: [
              { source: './src/demo.zip', destination: './dest/demo', type: 'zip'}
            ]
          },
          move: {
            items: [
              { source: './src/demo.zip', destination: './dest/demo.zip'}
            ]
          }
        }
      },
    })]
}
```

## Todo

1. Update option configuration in ReadMe doc.
2. Update copy feature in ReadMe doc. Support for `Array` input
3. Update cluster feature in Readme doc.


