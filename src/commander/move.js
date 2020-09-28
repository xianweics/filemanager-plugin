import { logger } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const move = ({ source, destination }, options = {}) => {
  const { log: logType } = options;
  
  try {
    glob.sync(source).forEach(source => {
      const dest = path.join(destination, path.basename(source));
      fs.moveSync(source, dest);
      logger
        .setType(logType)
        .info(`move: move '${source}' to '${destination}'`);
    });
  } catch (e) {
    logger.error(`move error: ${e}`);
  }
};

export default move;
