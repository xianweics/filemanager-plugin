import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';

const rename = ({ source, destination }) => {
  if (!fs.existsSync(source)) {
    handlerError(`rename error: '${source}' is not found in path`);
    return;
  }
  let src = source.slice(0, source.lastIndexOf('/'));
  let dst = destination.slice(0, destination.lastIndexOf('/'));
  if (src !== dst) {
    handlerError(`rename error: '${source}' and ${destination} are not in the same dir`);
    return;
  }

  try {
    fs.renameSync(source, destination);
    handlerInfo(`success: rename '${source}' to '${destination}'`);
  } catch (e) {
    handlerError(`rename error: rename '${source}' to '${destination}' failed ${e}`);
  }
};

export default rename;