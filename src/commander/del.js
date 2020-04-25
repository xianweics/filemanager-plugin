import { handlerError, handlerInfo } from '../utils';

const fs = require('fs-extra');
const glob = require('glob');

const del = file => {
  try {
    const files = glob.sync(file) || [];
    files.forEach(file => {
      fs.removeSync(file);
      handlerInfo(`success: delete '${file}'`);
    });
  } catch (e) {
    handlerError(`delete error: ${e}`);
  }
};

export default del;
