import { logger } from '../utils';

const compressing = require('compressing');
const glob = require('glob');

/**
 * @desc Unzip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @param globalOptions {Object}
 * @returns {Promise<void>}
 */

const unzip = async (
  { source, destination, type = 'zip' },
  globalOptions = {}
) => {
  const { log: logType } = globalOptions;

  try {
    const sources = glob.sync(source);
    for (const source of sources) {
      await new Promise((resolve, reject) => {
        compressing[type]
          .uncompress(source, destination)
          .then(() => {
            logger
              .setType(logType)
              .info(`success: unzip '${source}' to '${destination}'`);
            resolve();
          })
          .catch((e) => {
            logger.error(`unzip error: ${e}`);
            reject(e);
          });
      });
    }
  } catch (e) {
    logger.error(`unzip error: ${e}`);
  }
};

export default unzip;
