import { logger } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const move = async ({ source, destination }, options = {}) => {
  const { log: logType } = options;
  
  try {
    const sources = glob.sync(source) || [];
    
    for (const source of sources) {
      const dest = path.join(destination, path.basename(source));
      if (fs.existsSync(dest)) {
        fs.removeSync(dest);
      }
      fs.moveSync(source, dest);
      logger
        .setType(logType)
        .info(`move: move '${source}' to '${destination}'`);
    }
  } catch (e) {
    logger.error(`move error: ${e}`);
  }
};

export default move;
