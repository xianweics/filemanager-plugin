const compressing = require('compressing');
import fs from 'fs';
import { checkType, handlerError, handlerInfo, handlerWarn } from '../utils';

const checkParams = (srcPath, destinationPath, type, option) => {
  const VALID_TYPES = ['zip', 'tar', 'gzip', 'tgz'];
  
  if (!checkType.isString(srcPath)) {
    handlerError(`zip error: '${srcPath}' is not a string value`);
  }
  
  if (!checkType.isString(destinationPath)) {
    handlerError(`zip error: '${destinationPath}' is not a string value`);
  }
  
  if (!checkType.isString(type)) {
    handlerError(`zip error: '${type}' is not a string value`);
  }
  
  if (!checkType.isObject(option)) {
    handlerError(`zip error: '${option}' is not a object`);
  }
  
  if (!srcPath || !fs.existsSync(srcPath)) {
    handlerError(`zip error: '${srcPath}' is not found in path`);
  }
  if (!VALID_TYPES.includes(type)) {
    handlerError(`zip error: '${type}' is not valid`);
  }
  if (!destinationPath) {
    handlerError(`zip error: '${destinationPath}' is not found in path`);
  }
  if (fs.existsSync(destinationPath)) {
    handlerWarn(`zip warning: '${destinationPath}' would be override`);
  }
};

/**
 * @desc Zip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<void>}
 */
const zip = async ({ source, destination, type = 'zip', option = {}}) => {
  checkParams(source, destination, type, option);

  const isDirectory = fs.statSync(source).isDirectory();
  let fileType = 'compressFile';
  if (isDirectory) {
    fileType = 'compressDir';
    if (type === 'gzip') {
      handlerError(`zip error: Gzip only support compressing a single file. if you want to compress a dir with 'gzip', then you may need 'tgz' instead.`);
    }
  }
  await compressing[type][fileType](source, destination, option)
    .catch((e) => {
      handlerError(`zip error: ${e}`);
    });
  handlerInfo(`success: zip '${source}' to '${destination}'`);
};

export default zip;