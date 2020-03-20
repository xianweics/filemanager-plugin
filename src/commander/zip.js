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
const zip = async ({ source, destination, type = 'zip', option = {}}) => {
  try {
    await fsExtra.ensureDir(path.dirname(destination));
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
  } catch (e) {
    handlerError(`zip error: ${e}`);
  }
};

export default zip;