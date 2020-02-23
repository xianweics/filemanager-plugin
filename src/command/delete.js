/*
 * @Author: Tan Xuan
 * @Date: 2020-02-16 14:34:59
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-02-23 19:25:39
 * @Description: File content
 */
import fs from 'fs';

const del = (src) => {
  console.log('del', src)
  fs.stat(src, function (err, stats) {
    if (err) throw Error('the file or directory is not exist');
    if (stats.isFile()) {
      fs.unlinkSync(src)
    } else if (stats.isDirectory()) {
      fs.rmdirSync(src)
    }
  })
}

export default del;