import { handlerError, handlerInfo } from '../utils';
import { basename, join } from 'path';
const fs = require('fs-extra');
const glob = require('glob');

/**
 * @desc move files or directories
 * @param source {String} the source you want to move from
 * @param destination {String} the source you want to move to
 * @returns {Promise<void>}
 */
const move = async ({ source, destination }) => {
  const sources = glob.sync(source);
  try {
    if (sources.length) {
      sources.forEach(source => {
        const dest = join(destination, basename(source));
        fs.moveSync(source, dest);
        handlerInfo(`success: move '${source}' to '${dest}'`);
      });
    } else {
      fs.moveSync(source, destination);
      handlerInfo(`success: move '${source}' to '${destination}'`);
    }
  } catch (e) {
    handlerError(`move error: ${e}`);
  }
};

export default move;
