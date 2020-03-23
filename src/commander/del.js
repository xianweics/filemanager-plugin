import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');

/**
 * @desc delete the file/folders and handle other condition, like capture exception, extension methods
 * @param path {String}
 */
const del = path => {
  try {
    fs.removeSync(path);
    handlerInfo(`success: delete '${path}'`);
  } catch (e) {
    handlerError(`delete error: ${e}`);
  }
};

export default del;
