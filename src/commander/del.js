const { logger } = require('../utils');
const glob = require('glob');
const fs = require('fs-extra');

const del = (file, options = {}) => {
  const { log: logType } = options;
  try {
    const files = glob.sync(file);
    for (const file of files) {
      fs.removeSync(file);
      logger.setType(logType).info(`success: delete '${file}'`);
    }
  } catch (e) {
    logger.error(`delete error: ${e}`);
  }
};

module.exports = del;
