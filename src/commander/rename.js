const { renameSync } = require('fs-extra');
const { join } = require('path');
const { logger } = require('../utils');

const rename = ({
  path,
  oldName,
  newName
}, options = {}) => {
  const { log: logType } = options;
  try {
    const oldPath = join(path, oldName);
    const newPath = join(path, newName);
    renameSync(oldPath, newPath);
    logger
      .setType(logType)
      .info(`success: rename '${oldName}' to '${newName}'`);
  } catch (e) {
    logger.error(`rename error: ${e}`);
  }
};

module.exports = rename;
