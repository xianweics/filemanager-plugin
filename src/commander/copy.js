import { handlerError, handlerInfo } from '../utils';

const glob = require('glob');
const fs = require('fs-extra');

const copy = ({ source, destination }) => {
  try {
    const sources = glob.sync(source) || [];
    sources.forEach(source => {
      fs.copySync(source, destination);
      handlerInfo(`success: copy '${source}' to '${destination}'`);
    });
  } catch (e) {
    handlerError(`copy error: ${e}`);
  }
};

export default copy;
