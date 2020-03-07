import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');

/**
 * @desc delete the file/folders and handle other condition, like capture exception, extension methods
 * @param source {String}
 */
const del = ({ source }) => {
  try {
    fs.removeSync(source);
    handlerInfo(`success: delete '${source}'`);
  } catch (e) {
    handlerError(`delete error: ${e}`);
  }
};

export default del;