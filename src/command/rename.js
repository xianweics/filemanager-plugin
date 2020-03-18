import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';

let times = 0;

const rename = ({ source, destination }) => {
  if (!fs.existsSync(source)) {
    handlerError(`rename error: '${source}' is not found in path`);
  }
  let src = source.slice(0, source.lastIndexOf('/'));
  let dst = destination.slice(0, destination.lastIndexOf('/'));
  if (src !== dst) {
    handlerError(`rename error: '${source}' and ${destination} are not in the same dir`);
  }

  try {
    fs.renameSync(source, destination);
    handlerInfo(`success: rename '${source}' to '${destination}'`);
  } catch (e) {
    if (times < 3) {
      handlerInfo(`rename notice: rename '${source}' to '${destination}', this is the ${times}th retry`);
      fs.renameSync(source, destination);
      times += 1;
    } else {
      handlerError(`rename error: rename '${source}' to '${destination}' failed`);
    }
  }
};

export default rename;