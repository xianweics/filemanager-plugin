import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';
import { join } from 'path';

/**
 * rename
 * @param path {String}
 * @param oldName {String}
 * @param newName {String}
 */
const rename = ({ path, oldName, newName }) => {
  if (!fs.existsSync(path)) {
    handlerError(`rename error: '${path}' is not found in path`);
  }
  const oldPath = join(path, oldName);
  const newPath = join(path, newName);
  try {
    fs.renameSync(oldPath, newPath);
    handlerInfo(`success: rename '${oldName}' to '${newName}'`);
  } catch (e) {
    handlerError(`rename error: ${e}`);
  }
};

export default rename;
