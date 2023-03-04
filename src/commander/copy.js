const {
  flat,
  logger
} = require('../utils');
const globParent = require('glob-parent');
const { globSync } = require('glob');
const {
  copySync,
  renameSync,
  statSync
} = require('fs-extra');
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
    isFlat = true,
    name = ''
  } = restOption;
  const wrapSources = Array.isArray(source) ? source : [source];
  try {
    const sources = wrapSources.map((source) => globSync(source, globOptions));
    const parentPath = globParent(source, {});
    for (const source of flat(sources)) {
      const withFolderBaseName = source.substr(parentPath.length);
      const dest = join(destination,
        isFlat ? basename(source) : withFolderBaseName);
      copySync(source, dest);
      if (name && statSync(source).isFile()) {
        renameSync(dest, join(destination, name));
      }
      logger
        .setType(logType)
        .info(`success: copy '${source}' to '${destination}'`);
    }
  } catch (e) {
    logger.error(`copy error: ${e}`);
  }
};

module.exports = copy;
