# File manager plugin

[![Build Status](https://travis-ci.org/xianweics/filemanager-plugin.svg?branch=master)](https://travis-ci.org/xianweics/filemanager-plugin)
[![Coverage Status](https://coveralls.io/repos/github/xianweics/filemanager-plugin/badge.svg)](https://coveralls.io/github/xianweics/filemanager-plugin)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/xianweics/filemanager-plugin/blob/master/LICENSE)

# Overview

This filemanager plugin allows you to delete, zip/unzip(.zip/.tar/.tar.gz), move, rename, copy files or directories
 before and after builds.

# Installation
`npm install filemanager-plugin --save-dev`

# Usage

# Webpack.config.js

```javascript
const FileManagerPlugin = require('filemanager-plugin');

module.exports = {
  plugins: [
    new FileManagerPlugin({
      start: {
        // ...
      },
      end: {
        zip: [
          { source: './src/demo', destination: './dest/demo.zip', type: 'zip', option: { }}
        ],
        del: [
          { source: './src/demo' }
        ],
        unzip: [
          { source: './src/demo.zip', destination: './dest/demo', type: 'zip', option: { }},
        ]  
      }
    })
  ]
}
```

## APIs

### webpack.config.js

```javascrip
module.exports = {
  plugins: [new FileManagerPlugin(option)],
};
```

#### Events

- `start`: Adds a hook right before running the compiler.
Refer to webpack [beforeRun](https://webpack.js.org/api/compiler-hooks/#beforeRun) hook.
- `end`: Executed when the compilation has completed.
Refer to webpack [done](https://webpack.js.org/api/compiler-hooks/#done) hook.

The `start` and `end` events will register to compiler hooks in the
right way. In the example below, the start event with `unzip` command will run first, 
and then the end event with `zip` after.

```javascript
const FileManagerPlugin = require('filemanager-plugin');
module.exports = {
  plugins: [
    new FileManagerPlugin({
      start: {
        unzip: [
          { source: './src/demo0.zip', destination: './dest/demo0', type: 'zip'}
        ]
      },
      end: {
        zip: [
          { source: './src/demo1', destination: './dest/demo1.zip', type: 'zip', option: { }}
        ]
      }
    })
  ]
}
```

### Commands

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

```javascript
const FileManagerPlugin = require('filemanager-plugin');

module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        zip: [
          { source: './src/demo1', destination: './dest/demo1.zip', type: 'zip', option: { }}
        ],
        del: [
          { source: './src/demo2'}
        ]
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
      end: {
        zip: [
          { source: './src/demo1', destination: './dest/demo1.zip', type: 'zip', option: { }},
          { source: './src/demo2', destination: './dest/demo2.tar', type: 'tar'},
          { source: './src/demo3', destination: './dest/demo3.tgz', type: 'tgz'},
          { source: './src/demo4.html', destination: './dest/demo4.html.gz', type: 'gzip'},
          { source: './src/demo5.html', destination: './dest/demo5.html.zip', type: 'zip'}
        ]
      }
    })
  ]
}
```
- `source {String}`: Compressed source path which can be a file or directory.
- `destination {String}`: Compressed destination path.
- `type {String}`: Compressed type. Default is `zip`.
- `option {String}`: The same as [opts](https://github.com/node-modules/compressing#compressfile)

#### `unzip` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        unzip: [
          { source: './src/demo1.zip', destination: './dest/demo.zip'},
          { source: './src/demo2.tar', destination: './dest/demo.tar', type: 'tar'},
          { source: './src/demo3.tgz', destination: './dest/demo.tgz', type: 'tgz'},
          { source: './src/demo4.html.gz', destination: './dest/demo4.html', type: 'gzip'},
          { source: './src/demo5.html.zip', destination: './dest/demo5.html', type: 'zip'},
        ]
      }
    })
  ]
}
```

- `source {String}`: Uncompressed source path.
- `destination {String}`: Uncompressed destination path.
- `type {String}`: Uncompressed type. Default is `zip`.
- `option {String}`: The same as [opts](https://github.com/node-modules/compressing#compressfile)

#### `del` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        del: [
          { source: './src/demo'},
          { source: './src/demo1/index.html'}
        ]   
      }
    })
  ]
}
```

- `source {String}`: Deleted path which can be a file or directory.

#### `copy` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        copy: [
          { source: './src/demo', destination: './dest/demo'}
        ]  
      }
    })
  ]
}
```

- `source {String}`: Copied source path.
- `destination {String}`: Copied destination path.

#### `move` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        move: [
          { source: './src/demo1.zip', destination: './dest/demo.zip'}
        ]   
      }
    })
  ]
}
```

- `source {String}`: Moved source path.
- `destination {String}`: Moved destination path.

#### `rename` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        rename: [
          { source: './rename/b', destination: './rename/a' }
        ]   
      }
    })
  ]
}
```

- `source {String}`: Renamed source path.
- `destination {String}`: Renamed destination path.

# Support
[webpack](https://www.npmjs.com/search?q=keywords:webpack) <br/>
[gulp](https://www.npmjs.com/search?q=keywords:gulp): During planning <br/>
[rollup](https://www.npmjs.com/search?q=keywords:rollup): During planning <br/>

# Development Setup
```text
# install deps
npm install

# build lib files
npm run build

# run example to test plugin
cd example
npm run start

# build example to see final result
cd example
npm run build

# run unit test
npm run test

# show coverage report
npm run test:coverage

# watch unit test
npm run test:watch
```

