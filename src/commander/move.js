const { logger } = require('../utils');
const glob = require('glob');
const { moveSync } = require('fs-extra');
const {
  basename,
  join
} = require('path');
const move = ({ source, destination }, options = {}) => {
  const { log: logType } = options;

  try {
    glob.sync(source).forEach((source) => {
      const dest = join(destination, basename(source));
      moveSync(source, dest);
      logger
        .setType(logType)
        .info(`move: move '${source}' to '${destination}'`);
    });
  } catch (e) {
    logger.error(`move error: ${e}`);
  }
};

module.exports = move;
