import { handlerError, handlerInfo } from '../utils';

const compressing = require('compressing');
const glob = require('glob');

/**
 * @desc Unzip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<void>}
 */
const unzip = async ({ source, destination, type = 'zip', option = {} }) => {
  try {
    const sources = glob.sync(source);
    if (sources.length === 0) {
      handlerError(`unzip error: '${source}' is not exist`);
      return;
    }
    for (const source of sources) {
      await compressing[type].uncompress(source, destination, option);
      handlerInfo(`success: unzip '${source}' to ${destination}`);
    }
  } catch (e) {
    handlerError(`unzip error: ${e}`);
    return e;
  }
};

export default unzip;
