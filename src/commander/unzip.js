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
    const sources = glob.sync(source) || [];
    for (const source of sources) {
      await new Promise((resolve, reject) => {
        compressing[type]
          .uncompress(source, destination, option)
          .then(() => {
            handlerInfo(`success: unzip '${source}' to '${destination}'`);
            resolve();
          })
          .catch(e => {
            handlerError(`unzip error: ${e}`);
            reject(e);
          });
      });
    }
  } catch (e) {
    handlerError(`unzip error: ${e}`);
  }
};

export default unzip;
