const fs = require('fs');
import { checkType, handlerError, handlerInfo } from '../utils';

const copy = (src, dst) => {
  let paths = fs.readdirSync(src);
  paths.forEach(function (path) {
    const _src = src + '/' + path;
    const _dst = dst + '/' + path;

    if (fs.statSync(_src).isFile()) {
      const readable = fs.createReadStream(_src);
      const writable = fs.createWriteStream(_dst);
      readable.pipe(writable);
      handlerInfo(`success: copy '${_src} to ${dst}'`);
    } else {
      checkDirectory({ source: _src, destination: _dst });
    }
  });
};

const checkDirectory = ({ source, destination }) => {
  if (!checkType.isString(source)) {
    handlerError(`copy error: '${source}' is not a string value`);
  }
  if (!fs.existsSync(source)) {
    handlerError(`copy error: '${source}' is not found in path`);
  }
  if (fs.statSync(source).isFile()) {
    let index = destination.lastIndexOf('/');
    let dst = destination.slice(0, index);
    if (!fs.existsSync(dst)) {
      makeDir(dst);
    }
    const readable = fs.createReadStream(source);
    const writable = fs.createWriteStream(destination);
    readable.pipe(writable);
    handlerInfo(`success: copy '${source}' to '${destination}'`);
  } else {
    if (!fs.existsSync(destination)) {
      makeDir(destination);
    }
    copy(source, destination);
  }
};

// if not exists, make the dir
function makeDir (dir) {
  let arr = dir.split('/');
  let dst = arr[0];
  for (let i = 1; i < arr.length; i++) {
    dst = dst + '/' + arr[i];
    if (!fs.existsSync(dst)) {
      fs.mkdirSync(dst);
    } else {
      continue;
    }
  }
}

export default checkDirectory;