import fs from 'fs';

const del = function (path) {
  let files = [];
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      files = fs.readdirSync(path);
      files.forEach(function (file) {
        let curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
          del(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }

  } else {
    throw Error('path is not find')
  }
}
export default del