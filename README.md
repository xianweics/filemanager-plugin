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

## Webpack

### webpack.config.js

```javascript
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;

module.exports = {
  plugins: [
    new FileManagerPlugin({
      events: {
        start: {},
        end: {
          zip: {
            items: [
              { source: './src/demo', destination: './dest/demo.zip', type: 'zip'}
            ]
          },
          del: {
            items: ['./dist']
          }
        }
      }
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
               { source: './src/demo1', destination: './dest/demo1.zip', type: 'zip', option: { }},
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
- `option {String}`: The same as [opts](https://github.com/node-modules/compressing#compressfile)

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
- `option {String}`: The same as [opts](https://github.com/node-modules/compressing#compressfile)

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

- `source {String}`: Moved source path. [glob pattern](https://github.com/isaacs/node-glob).
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


# APIs

## events

- `start`: Adds a hook right before running the compiler.
Refer to webpack [beforeRun](https://webpack.js.org/api/compiler-hooks/#beforeRun) hook.
- `end`: Executed when the compilation has completed.
Refer to webpack [done](https://webpack.js.org/api/compiler-hooks/#done) hook.

The `start` and `end` events will register to compiler hooks in the
right way. In the example below, the start event with `unzip` command will run first, 
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
      },
      // customHooks: [
      //   {
      //     hookType: 'tapAsync',
      //     hookName: 'beforeRun',
      //     commands: {
      //       del: {
      //         items: ['./dist']
      //       }
      //     }
      //   }
      // ]
    })
  ]
}
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
Also, each operate will be executed in order base on `Array` order.
In this example below, in the end event, the zip command will run first, and then the delete after:

# Upgrade

```javascript
const FileManagerPlugin = require('filemanager-plugin').WebpackFilemanager;

// 1.X.X
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
          { source: './src/demo', destination: './dest/demo.zip', type: 'zip', option: { }}
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

// 2.X.X
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
              { source: './src/demo', destination: './dest/demo.zip', type: 'zip', option: { }}
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
              { source: './src/demo.zip', destination: './dest/demo', type: 'zip', option: { }}
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


