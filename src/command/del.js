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
  
  deleteFolder(source);
  handlerInfo(`success: delete '${source}'`);
};

const deleteFolder = (path) => {
  fs.readdirSync(path).forEach((file) => {
    let curPath = path + '/' + file;
    if (fs.statSync(curPath).isDirectory()) {
      deleteFolder(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(path);
};

export default del;
