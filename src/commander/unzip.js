const compressing = require('compressing');
const { globSync } = require('glob');
const { logger } = require('../utils');

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
  {
    source,
    destination,
    type = 'zip',
    option
  },
  globalOptions = {}
) => {
  const { log: logType } = globalOptions;
  
  try {
    const sources = globSync(source);
    for (const source of sources) {
      await new Promise((resolve, reject) => {
        compressing[type]
          .uncompress(source, destination, option)
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

module.exports = unzip;
