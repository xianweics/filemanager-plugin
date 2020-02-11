import { cp } from "./command";

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
      }
      await FileManagerPlugin.sleep(1);
      cb();
      console.info('after emit done');
    });
  }
}

export default FileManagerPlugin;