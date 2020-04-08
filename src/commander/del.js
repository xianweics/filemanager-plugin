import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');

/**
 * @desc delete the file/folders and handle other condition, like capture exception, extension methods
 * @param source {String}
 */
const del = ({ source }) => {
  const files = glob.sync(source);
  try {
    files.forEach(file => {
      fs.removeSync(file);
      handlerInfo(`success: delete '${file}'`);
    });
  } catch (e) {
    handlerError(`delete error: ${e}`);
  }
};

export default del;
