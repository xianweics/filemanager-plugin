import fs from 'fs';
import { checkType, handlerError, handlerInfo } from '../utils';

/**
 * @desc Delete file/folder.
 * @param source {String}
 */
const del = function ({ source }) {
  if (!checkType.isString(source)) {
    handlerError(`delete error: '${source}' is not a string value`);
  }
  if (!fs.existsSync(source)) {
    handlerError(`delete error: '${source}' is not found in path`);
  }
  if (fs.statSync(source).isDirectory()) {
    deleteFolder(source);
    handlerInfo(`success: delete '${source}'`);
  } else {
    fs.unlinkSync(source);
    handlerInfo(`success: delete '${source}'`);
  }
};

function deleteFolder (path) {
  let files = fs.readdirSync(path);
  files.forEach(function (file) {
    let curPath = path + '/' + file;
    if (fs.statSync(curPath).isDirectory()) {
      del(curPath);
      handlerInfo(`success: delete '${curPath}'`);
    } else {
      fs.unlinkSync(curPath);
      handlerInfo(`success: delete '${curPath}'`);
    }
  });
  fs.rmdirSync(path);
  handlerInfo(`success: delete '${path}'`);
}

export default del;
