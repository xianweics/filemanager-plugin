import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');

/**
 * @desc move files or directories
 * @param source {String} the source you want to move from
 * @param destination {String} the source you want to move to
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
