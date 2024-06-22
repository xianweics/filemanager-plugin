const { logger } = require('../utils');
const { globSync } = require('glob');
const { moveSync } = require('fs-extra');
const {
  basename,
  join
} = require('path');
const move = ({ source, destination, option }, options = {}) => {
  const { log: logType } = options;
  try {
    globSync(source).forEach((source) => {
      const dest = join(destination, basename(source));
      moveSync(source, dest, option);
      logger
        .setType(logType)
        .info(`move: move '${source}' to '${destination}'`);
    });
  } catch (e) {
    logger.error(`move error: ${e}`);
  }
};

module.exports = move;
