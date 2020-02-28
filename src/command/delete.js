const fs = require('fs');

const del = (src) => {
  // console.log('del', src);
  fs.stat(src, function (err, stats) {
    if (err) throw Error('the file or directory is not exist');
    if (stats.isFile()) {
      fs.unlinkSync(src)
    } else if (stats.isDirectory()) {
      fs.rmdirSync(src)
    }
  })
};

export default del;