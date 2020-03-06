import fs from 'fs';
import { checkType, handlerError, handlerInfo } from '../utils';

/**
 * @desc Delete file/folder.
 * @param source {String}
 */
const del = ({ source }) => {
  if (!checkType.isString(source)) {
    handlerError(`delete error: '${source}' is not a string value`);
  }
  if (!fs.existsSync(source)) {
    handlerError(`delete error: '${source}' is not found in path`);
  }
  try {
    if (fs.statSync(source).isDirectory()) {
      deleteFolder(source);
    } else {
      fs.unlinkSync(source);
    }
    handlerInfo(`success: delete '${source}'`);
  } catch (e) {
    handlerError(`delete error: ${e}`);
  }
};

function deleteFolder (path) {
  const files = fs.readdirSync(path);
  files.forEach(function (file) {
    const curPath = path + '/' + file;
    if (fs.statSync(curPath).isDirectory()) {
      deleteFolder(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(path);
}

export default del;
