class FileManagerPlugin {
  constructor (opts) {
    this.options = opts;
  }
  
  static sleep (time, cb = () => {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        cb();
        resolve();
      }, time * 1000);
    })
  }
  
  apply (compiler) {
    compiler.hooks.afterEmit.tapAsync('afterEmit', async (compilation, cb) => {
      await FileManagerPlugin.sleep(5);
      cb();
      console.info('after emit done');
    });
  }
}

export default FileManagerPlugin;