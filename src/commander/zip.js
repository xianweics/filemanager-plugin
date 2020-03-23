const compressing = require('compressing');
const fsExtra = require('fs-extra');
import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';
import path from 'path';

/**
 * @desc Zip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<void>}
 */
const zip = async ({ source, destination, type = 'zip', option = {} }) => {
  try {
    await fsExtra.ensureDir(path.dirname(destination));
    const isDirectory = fs.statSync(source).isDirectory();
    if (
      !isCheckGzipType(isDirectory, type) ||
      isCheckDirectorySame(source, destination)
    ) {
      return;
    }
    const fileType = getFileType(isDirectory);
    await compressing[type][fileType](source, destination, option);
    handlerInfo(`success: zip '${source}' to '${destination}'`);
  } catch (e) {
    handlerError(`zip error: ${e}`);
  }

  /**
   * to check compressing is error when the source is directory and the type is gzip
   * @param {*} isDirectory directory is true or false
   * @param {*} type type of compressing
   */
  function isCheckGzipType(isDirectory, type) {
    if (isDirectory && type === 'gzip') {
      handlerError(
        `zip error: Gzip only support compressing a single file. if you want to compress a dir with 'gzip', then you may need 'tgz' instead.`
      );
    }
    return true;
  }

  /**
   * check path is same
   * @param {*} source
   * @param {*} destination
   */
  function isCheckDirectorySame(source, destination) {
    const parseInfo = path.parse(source);
    const sourceDirectory = parseInfo.dir + path.sep + parseInfo.base;
    const destDirectory = path.dirname(destination);
    if (sourceDirectory === destDirectory) {
      handlerError(
        `zip error: If the type of compression is a folder, the original and target directories passed in cannot be the same`
      );
    }
    return false;
  }

  /**
   * get file type
   * @param {*} isDirectory
   */
  function getFileType(isDirectory) {
    return isDirectory ? 'compressDir' : 'compressFile';
  }
};

export default zip;
