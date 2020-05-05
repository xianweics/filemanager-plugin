import { logger } from '../utils';

const glob = require('glob');
const fs = require('fs-extra');
const copy = ({ source, destination }, options = {}) => {
  const { log: logType } = options;
  try {
    const sources = glob.sync(source) || [];
    sources.forEach(source => {
      fs.copySync(source, destination);
      logger.setType(logType).info(`success: copy '${source}' to '${destination}'`);
    });
  } catch (e) {
    logger.error(`copy error: ${e}`);
  }
};

export default copy;
