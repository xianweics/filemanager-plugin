import { logger } from '../utils';

const Compressing = require('compressing');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

/**
 * @desc Zip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param globalOptions
 * @param option {Object}
 * @returns {Promise<void>}
 */
const zip = async (
  { source, destination, type = 'zip' },
  globalOptions = {}
) => {
  const { log: logType } = globalOptions;

  try {
    const sources = glob.sync(source);
    if (sources.length === 0) {
      logger.error(`zip error: '${source}' is not exist`);
      return;
    }
    fs.ensureDirSync(path.dirname(destination));
    if (type === 'gzip') {
      // gzip
      const hasDirectory = sources.find((source) =>
        fs.statSync(source).isDirectory()
      );
      if (sources.length > 1 || hasDirectory) {
        logger.error(`zip error: Gzip only support compressing a single file`);
        return;
      }
      await new Promise((resolve, reject) => {
        Compressing.gzip
          .compressFile(source, destination)
          .then(() => {
            logger
              .setType(logType)
              .info(`success: zip '${source}' to '${destination}'`);
            resolve();
          })
          .catch((e) => {
            logger.error(`zip error: ${e}`);
            reject(e);
          });
      });
    } else {
      // tar, zip, tgz
      const targetStream = new Compressing[type].Stream();
      for (const item of sources) {
        targetStream.addEntry(item);
      }
      await new Promise((resolve, reject) => {
        targetStream
          .pipe(fs.createWriteStream(destination))
          .on('finish', () => {
            logger
              .setType(logType)
              .info(`success: zip '${source}' to '${destination}'`);
            resolve();
          })
          .on('error', (e) => {
            logger.error(`zip error: ${e}`);
            reject(e);
          });
      });
    }
  } catch (e) {
    logger.error(`zip error: ${e}`);
  }
};

export default zip;
