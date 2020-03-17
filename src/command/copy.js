import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');

/**
 * @desc copy files or folders and handle other condition, like capture exception, extension methods
 * @param source {String}
 * @param destination {String}
 */
const copy = async ({ source, destination }) => {
  try {
    fs.copySync(source, destination);
    handlerInfo(`success: copy '${source}' to '${destination}'`);
  } catch (e) {
    handlerError(`copy error: ${e}`);
  }
};

export default copy;