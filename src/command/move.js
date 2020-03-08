import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');

/**
 * @desc move files or directories
 * @param source {String}
 * @param destination {String}
 * @returns {Promise<void>}
 */
const move = async ({ source, destination }) => {
  try {
    fs.moveSync(source, destination);
    handlerInfo(`success: move '${source}' to '${destination}'`);
  } catch (e) {
    handlerError(`move error: ${e}`);
  }
};

export default move;
