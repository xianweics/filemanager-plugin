const {
  flat,
  logger
} = require('../utils');
const globParent = require('glob-parent');
const glob = require('glob');
const fs = require('fs-extra');
const {
  basename,
  join
} = require('path');

const copy = ({
  source,
  destination,
  globOptions = {},
  ...restOption
}, globalOptions = {}) => {
  const {
    log: logType
  } = globalOptions;
  const {
    isFlat = true
  } = restOption;
  const wrapSources = Array.isArray(source) ? source : [source];
  try {
    const sources = wrapSources.map((source) => glob.sync(source, globOptions));
    const parentPath = globParent(source, {});
    for (const source of flat(sources)) {
      const withFolderBaseName = source.substr(parentPath.length);
      const dest = join(destination,
        isFlat ? basename(source) : withFolderBaseName);
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
