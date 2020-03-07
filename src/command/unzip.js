const compressing = require('compressing');
const fsExtra = require('fs-extra');
import { handlerError, handlerInfo } from '../utils';
import path from 'path';

/**
 * @desc Unzip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<void>}
 */
const unzip = async ({ source, destination, type = 'zip', option = { }}) => {
  try {
    await fsExtra.ensureDir(path.dirname(destination));
    await compressing[type].uncompress(source, destination, option).catch((e) => {
      handlerError(`unzip error: ${e}`);
    });
    handlerInfo(`success: unzip '${source}' to ${destination}`);
  } catch (e) {
    handlerError(`unzip error: ${e}`);
  }
};

export default unzip;