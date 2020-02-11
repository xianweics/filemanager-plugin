import fs from 'fs';
const copy = (src, dst) => {
  let paths = fs.readdirSync(src);
  paths.forEach(function (path) {
    const _src = src + '/' + path;
    const _dst = dst + '/' + path;
    fs.stat(_src, function (err, stats) {
      if (err) throw err;
      if (stats.isFile()) {
        const readable = fs.createReadStream(_src);
        const writable = fs.createWriteStream(_dst);
        readable.pipe(writable);
      } else if (stats.isDirectory()) {
        checkDirectory(_src, _dst, copy);
      }
    });
  });
};

const checkDirectory = (src, dst) => {
  fs.access(dst, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(dst);
    }
    copy(src, dst);
  });
};

export default checkDirectory;