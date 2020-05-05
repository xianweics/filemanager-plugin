import { logger } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');

const del = file => {
  try {
    const files = glob.sync(file) || [];
    files.forEach(file => {
      fs.removeSync(file);
      logger.info(`success: delete '${file}'`);
    });
  } catch (e) {
    logger.error(`delete error: ${e}`);
  }
};

export default del;
