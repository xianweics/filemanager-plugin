const compressing = require('compressing');
import fs from 'fs';
import { handlerError, handlerInfo, handlerWarn } from '../utils';

const checkParams = (srcPath, destPath, type) => {
  const VALID_TYPES = ['zip', 'tar', 'gzip'];

  if (!fs.existsSync(srcPath)) {
    handlerError(`zip error: '${srcPath}' is not found in path`);
  }
  if (!VALID_TYPES.includes(type)) {
    handlerError(`zip error: '${type}' is not valid`);
  }
  if (fs.existsSync(destPath)) {
    handlerWarn(`zip warning: '${destPath}' will be override`);
  }
};

/**
 * @desc Zip file/folder. Support zip, tar, gzip.
 * @param src {string}
 * @param dest {string}
 * @param type {string}
 * @returns {Promise<void>}
 */
const zip = async (src, dest, type = 'zip') => {
  checkParams(src, dest, type);

  const fileType = fs.statSync(src).isDirectory() ?
    'compressDir' : 'compressFile';

  await compressing[type][fileType](src, dest)
    .catch((e) => {
      handlerError(`zip error: ${e}`);
    });
  handlerInfo(`success: zip '${src}' to '${dest}'`);
};

export default zip;