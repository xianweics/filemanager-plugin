import { handlerError, handlerInfo } from '../utils';
import { basename, join } from 'path';

const glob = require('glob');
const fs = require('fs-extra');

/**
 * @desc copy files or folders and handle other condition, like capture exception, extension methods
 * @param source {String}
 * @param destination {String}
 * @param options
 */
const copy = async ({ source, destination }) => {
  const sources = glob.sync(source) || [];

  try {
    if (sources.length > 0) {
      // match glob pattern
      sources.forEach(source => {
        const dest = join(destination, basename(source));
        fs.copySync(source, dest);
        handlerInfo(`success: copy '${source}' to '${dest}'`);
      });
    } else {
      // regular path
      fs.copySync(source, destination);
      handlerInfo(`success: copy '${source}' to '${destination}'`);
    }
  } catch (e) {
    handlerError(`copy error: ${e}`);
  }
};

export default copy;
