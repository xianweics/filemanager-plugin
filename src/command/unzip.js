const compressing = require('compressing');
import fs from 'fs';
import { checkType, handlerError, handlerInfo, handlerWarn } from '../utils';

const checkParams = (srcPath, destinationPath, type) => {
  const VALID_TYPES = ['zip', 'tar', 'gzip', 'tgz'];
  
  if (!checkType.isString(srcPath)) {
    handlerError(`unzip error: '${srcPath}' is not a string value`);
  }
  
  if (!checkType.isString(destinationPath)) {
    handlerError(`unzip error: '${destinationPath}' is not a string value`);
  }
  
  if (!checkType.isString(type)) {
    handlerError(`unzip error: '${type}' is not a string value`);
  }
  
  if (!fs.existsSync(srcPath)) {
    handlerError(`unzip error: '${srcPath}' is not found in path`);
  }
  
  if (!VALID_TYPES.includes(type)) {
    handlerError(`unzip error: '${type}' is not valid`);
  }
  if (!destinationPath) {
    handlerError(`zip error: '${destinationPath}' is not found in path`);
  }
  if (fs.existsSync(destinationPath)) {
    handlerWarn(`unzip warning: '${destinationPath}' would be override`);
  }
};

/**
 * @desc Unzip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @returns {Promise<void>}
 */
const unzip = async ({ source, destination, type = 'zip' }) => {
  checkParams(source, destination, type);

  await compressing[type].uncompress(source, destination).catch((e) => {
    handlerError(`unzip error: ${e}`);
  });
  handlerInfo(`success: unzip '${source}' to ${destination}`);
};

export default unzip;