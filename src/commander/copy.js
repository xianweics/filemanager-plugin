const {
  flat,
  logger
} = require('../utils');
const glob = require('glob');
const fs = require('fs-extra');
const {
  basename,
  join
} = require('path');

const copy = ({
  source,
  destination
}, options = {}) => {
  const { log: logType } = options;
  const wrapSources = Array.isArray(source) ? source : [source];

  try {
    const sources = wrapSources.map((source) => glob.sync(source));
    for (const source of flat(sources)) {
      const dest = join(destination, basename(source));
      fs.copySync(source, dest);
      logger
        .setType(logType)
        .info(`success: copy '${source}' to '${destination}'`);
    }
  } catch (e) {
    logger.error(`copy error: ${e}`);
  }
};

module.exports = copy;
