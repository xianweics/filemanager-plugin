import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';

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
  const source = path[path.length - 1] !== '/' ? path + '/' : path;
  try {
    const oldPath = source + oldName;
    const newPath = source + newName;
    fs.renameSync(oldPath, newPath);
    handlerInfo(`success: rename '${oldName}' to '${newName}'`);
  } catch (e) {
    handlerError(`rename error: ${e}`);
  }
};

export default rename;