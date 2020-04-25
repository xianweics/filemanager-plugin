import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';
import { join } from 'path';

const rename = ({ path, oldName, newName }) => {
  try {
    const oldPath = join(path, oldName);
    const newPath = join(path, newName);
    fs.renameSync(oldPath, newPath);
    handlerInfo(`success: rename '${oldName}' to '${newName}'`);
  } catch (e) {
    handlerError(`rename error: ${e}`);
  }
};

export default rename;
