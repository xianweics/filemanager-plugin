import fs from 'fs';
import copy from './copy';
import del from './del';
import { checkType, handlerError } from '../utils';

const move = async ({ source, destination }) => {
  if (!checkType.isString(source)) {
    handlerError(`move error: '${source}' is not a string value`);
  }
  if (!fs.existsSync(source)) {
    handlerError(`move error: '${source}' is not found in path`);
  }

  await copy({ source, destination });

  del({ source });

};


export default move;
