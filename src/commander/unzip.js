const compressing = require('compressing');
import { handlerError, handlerInfo } from '../utils';

const glob = require('glob');

/**
 * @desc Unzip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<Error>}
 */
const unzip = async ({ source, destination, type = 'zip', option = {} }) => {
  try {
    const sources = glob.sync(source);
    console.info(source, 11);
    if (sources.length === 0) {
      handlerError(`unzip error: '${source}' is not exist`);
      return new Error();
    }
    for (const source of sources) {
      await compressing[type]
        .uncompress(source, destination, option)
        .catch(e => {
          handlerError(`unzip error: ${e}`);
        });
      handlerInfo(`success: unzip '${source}' to ${destination}`);
    }
  } catch (e) {
    handlerError(`unzip error: ${e}`);
    return e;
  }
};

export default unzip;
