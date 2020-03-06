import fs from 'fs';
import { checkType, handlerError, handlerInfo } from '../utils';

let times = 0;

const move = ({ source, destination }) => {
  if (!checkType.isString(source)) {
    handlerError(`move error: '${source}' is not a string value`);
  }
  if (!fs.existsSync(source)) {
    handlerError(`move error: '${source}' is not found in path`);
  }

  try {
    fs.renameSync(source, destination);
    handlerInfo(`success: move '${source}' to '${destination}'`);
  } catch (e) {
    if (times < 3) {
      handlerInfo(`move notice: move '${source}' to '${destination}', this is the ${times}th retry`);
      fs.renameSync(source, destination);
      times += 1;
    } else {
      handlerError(`move error: move '${source}' to '${destination}' failed`);
    }
  }
};

// const checkDirectory = (src, dst) => {
//   fs.access(dst, fs.constants.F_OK, (err) => {
//     if (err) {
//       fs.mkdirSync(dst);
//     }
//     move(src, dst);
//   });
// };


export default move;
