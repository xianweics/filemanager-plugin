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
      checkDirectory(_src, _dst, copy);
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
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination.split('/')[0]);
    }
    const readable = fs.createReadStream(source);
    const writable = fs.createWriteStream(destination);
    readable.pipe(writable);
    handlerInfo(`success: copy '${source}'`);
  } else {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }
    copy(source, destination);
  }
};

export default checkDirectory;