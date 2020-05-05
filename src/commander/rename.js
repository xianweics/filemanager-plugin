import fs from 'fs';
import { logger } from '../utils';
import { join } from 'path';

const rename = ({ path, oldName, newName }, options = {}) => {
  const { log: logType } = options;
  try {
    const oldPath = join(path, oldName);
    const newPath = join(path, newName);
    fs.renameSync(oldPath, newPath);
    logger
      .setType(logType)
      .info(`success: rename '${oldName}' to '${newName}'`);
  } catch (e) {
    logger.error(`rename error: ${e}`);
  }
};

export default rename;
