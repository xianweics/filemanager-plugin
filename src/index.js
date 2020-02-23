/*
 * @Author: Tan Xuan
 * @Date: 2020-02-16 14:34:59
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-02-23 19:24:36
 * @Description: File content
 */
import { cp, del } from "./command";

class FileManagerPlugin {
  constructor (opts) {
    this.options = opts;
  }
  
  static sleep (time, cb = () => {
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        cb();
        resolve();
      }, time * 1000);
    })
  }
  
  apply (compiler) {
    const { end } = this.options;
    compiler.hooks.afterEmit.tapAsync('afterEmit', async (compilation, cb) => {
      if (end) {
        if (end.copy) {
          end.copy.forEach(item => cp(item.source, item.destination));
        }
        if (end.del) {
          setTimeout(() => {
            end.del.forEach(item => del(item))
          }, 300)
        }
      }
      await FileManagerPlugin.sleep(1);
      cb();
      console.info('after emit done');
    });
  }
}

export default FileManagerPlugin;