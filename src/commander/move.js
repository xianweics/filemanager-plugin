import { logger } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const move = ({ source, destination }) => {
  try {
    const sources = glob.sync(source) || [];
    sources.forEach(source => {
      fs.moveSync(source, path.join(destination, path.basename(source)));
      logger.info(`move: move '${source}' to '${destination}'`);
    });
  } catch (e) {
    logger.error(`move error: ${e}`);
  }
};

export default move;
