import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const move = ({ source, destination }) => {
  try {
    const sources = glob.sync(source) || [];
    sources.forEach(source => {
      fs.moveSync(source, path.join(destination, path.basename(source)));
      handlerInfo(`move: move '${source}' to '${destination}'`);
    });
  } catch (e) {
    handlerError(`move error: ${e}`);
  }
};

export default move;
