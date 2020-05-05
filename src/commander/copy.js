import { logger } from '../utils';

const glob = require('glob');
const fs = require('fs-extra');
const copy = ({ source, destination }) => {
  try {
    const sources = glob.sync(source) || [];
    sources.forEach(source => {
      fs.copySync(source, destination);
      logger.info(`success: copy '${source}' to '${destination}'`);
    });
  } catch (e) {
    logger.error(`copy error: ${e}`);
  }
};

export default copy;
