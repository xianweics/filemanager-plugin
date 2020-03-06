# File manager plugin

[![Build Status](https://travis-ci.org/xianweics/filemanager-plugin.svg?branch=master)](https://travis-ci.org/xianweics/filemanager-plugin)
[![Coverage Status](https://coveralls.io/repos/github/xianweics/filemanager-plugin/badge.svg)](https://coveralls.io/github/xianweics/filemanager-plugin)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/xianweics/filemanager-plugin/blob/master/LICENSE)

This filemanager plugin allows you to copy, zip/unzip (.zip/.tar/.tar.gz), move, rename, delete files or directories
before and after builds. Also, you can customize the lifecycle of webpack during building.

# Install
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
          { source: './src/demo', destination: './src/demo.zip', type: 'zip'}
        ],
        del: [
          { source: './src/demo' } 
        ],
        unzip: [
          { source: './src/demo.zip', destination: './src/demo', type: 'zip'},
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
  plugins: [new FileManagerPlugin(Option)],
};
```

#### Options

- **start**: Hook into the compiler before it begins reading records.
- **end**: Called after emitting assets to output directory.

### Commands

|  Name   | Type  |  Description |
|  :---   | :---  |      ---     |
| `zip`    | `{Array}` | Zip files or directories by using `tar`, `tgz`, `gzip` or `zip`. However, `gzip` only supports compress single file. You need to use `tgz` to zip a directory. |
| `unzip`  | `{Array}` | Unzip files or directories. The usage is Same as `zip`. |
| `del`    | `{Array}` | Delete multiple files or directories. |

#### `zip` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        zip: [
          { source: './src/demo1', destination: './src/demo1.zip', type: 'zip'},
          { source: './src/demo2', destination: './src/demo2.tar', type: 'tar'},
          { source: './src/demo3', destination: './src/demo3.tgz', type: 'tgz'},
          { source: './src/demo4.html', destination: './src/demo4.html.gz', type: 'gzip'},
          { source: './src/demo5.html', destination: './src/demo5.zip'} // Default type: zip
        ]
      }
    })
  ]
}
```

#### `unzip` example

```javascript
module.exports = {
  plugins: [
    new FileManagerPlugin({
      end: {
        unzip: [
          { source: './src/demo1.zip', destination: './src/demo.zip'}, // Default type: zip
          { source: './src/demo2.tar', destination: './src/demo.tar', type: 'tar'},
          { source: './src/demo3.tgz', destination: './src/demo.tgz', type: 'tgz'},
          { source: './src/demo4.html.gz', destination: './src/demo4.html', type: 'gzip'},
          { source: './src/demo5.html.zip', destination: './src/demo5.html', type: 'zip'},
        ]
      }
    })
  ]
}
```

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

# Support
[webpack](https://www.npmjs.com/search?q=keywords:webpack): **Upcoming Releases 12 Mar. 2020** <br/>
[gulp](https://www.npmjs.com/search?q=keywords:gulp): during planning <br/>
[rollup](https://www.npmjs.com/search?q=keywords:rollup): during planning <br/>

# Development Setup
```text
# install deps
npm install

# build lib files
npm run build

# run example to see result
cd example
npm run start

# run unit test
npm run test

# show coverage report
npm run test:coverage

# watch unit test
npm run test:watch
```

