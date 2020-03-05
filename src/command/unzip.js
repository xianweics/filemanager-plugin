const compressing = require('compressing');
import fs from 'fs';
import { handlerError, handlerInfo, handlerWarn } from '../utils';

const checkParams = (srcPath, destPath, type) => {
  const VALID_TYPES = ['zip', 'tar', 'gzip'];

  if (!fs.existsSync(srcPath)) {
    handlerError(`unzip error: '${srcPath}' is not found in path`);
  }
  if (!VALID_TYPES.includes(type)) {
    handlerError(`unzip error: '${type}' is not valid`);
  }
  if (fs.existsSync(destPath)) {
    handlerWarn(`unzip warning: '${destPath}' will be override`);
  }
};

/**
 * @desc Unzip file/folder. Support zip, tar, gzip.
 * @param src {string}
 * @param dest {string}
 * @param type {string}
 * @returns {Promise<void>}
 */
const unzip = async (src, dest, type = 'zip') => {
  checkParams(src, dest, type);

  await compressing[type].uncompress(src, dest).catch((e) => {
    handlerError(`unzip error: ${e}`);
  });
  handlerInfo(`success: unzip '${src}' to ${dest}`);
};

export default unzip;