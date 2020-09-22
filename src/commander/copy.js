import { flat, isSameFile, logger } from '../utils';

const glob = require('glob');
const fs = require('fs-extra');
const { basename, join } = require('path');

const copy = async ({ source, destination }, options = {}) => {
  const { log: logType } = options;
  const wrapSources = Array.isArray(source) ? source : [source];

  try {
    const sources = wrapSources.map((source) => glob.sync(source) || []);
    for (const source of flat(sources)) {
      const dest = join(destination, basename(source));
      const isSame = await isSameFile(source, dest);
      if (isSame) {
        logger
          .setType(logType)
          .info(`skip: copy '${source}' to '${destination}'`);
      } else {
        fs.copySync(source, dest);
        logger
          .setType(logType)
          .info(`success: copy '${source}' to '${destination}'`);
      }
    }
  } catch (e) {
    logger.error(`copy error: ${e}`);
  }
};

export default copy;
