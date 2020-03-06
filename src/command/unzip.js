const compressing = require('compressing');
import fs from 'fs';
import { checkType, handlerError, handlerInfo, handlerWarn } from '../utils';

const checkParams = (srcPath, destinationPath, type, option) => {
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
  
  if (!checkType.isObject(option)) {
    handlerError(`unzip error: '${option}' is not a object`);
  }
  
  if (!fs.existsSync(srcPath)) {
    handlerError(`unzip error: '${srcPath}' is not found in path`);
  }
  
  if (!VALID_TYPES.includes(type)) {
    handlerError(`unzip error: '${type}' is not valid`);
  }
  if (!destinationPath) {
    handlerError(`unzip error: '${destinationPath}' is not found in path`);
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
 * @param option {Object}
 * @returns {Promise<void>}
 */
const unzip = async ({ source, destination, type = 'zip', option = { }}) => {
  checkParams(source, destination, type, option);

  await compressing[type].uncompress(source, destination, option).catch((e) => {
    handlerError(`unzip error: ${e}`);
  });
  handlerInfo(`success: unzip '${source}' to ${destination}`);
};

export default unzip;