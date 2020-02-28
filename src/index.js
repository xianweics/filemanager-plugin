import * as command from "./command";

const info = console.info;

class FileManagerPlugin {
  static HOOK_NAME = 'FileManagerPlugin';
  static HOOKS_MAP = {
    'start': {
      hookType: 'tapAsync',
      hookName: 'run',
      customHookName: 'run'
    },
    'end': {
      hookType: 'tapAsync',
      hookName: 'afterEmit',
      customHookName: 'afterEmit'
    }
  };
  static USER_VALID_HOOKS = Object.keys(this.HOOKS_MAP);
  
  constructor (opts) {
    this.options = opts;
  }
  
  /**
   * @todo need to removed
   * @desc mock runtime for testing
   * @param time {number}
   * @param cb
   * @returns {Promise<void>}
   */
  static sleep (time, cb) {
    return new Promise(resolve => {
      setTimeout(() => {
        cb && cb();
        resolve();
      }, time * 1000);
    });
  }
  
  /**
   * todo: need to be optimized
   * @desc execute according command information
   * @param jobs {Object}
   * @returns {Promise<void>}
   */
  static async handlerJobs (jobs) {
    for (const job of Object.entries(jobs)) {
      const [type, arr] = job;
      if (type === 'compress' || type === 'uncompress') {
        for (const item of arr) {
          await command[type](item.source, item.destination);
        }
      } else if (type === 'del') {
        // await optionDel.forEach(item => del(item));
      }
    }
  }
  
  /**
   * @desc translate 'options' to other options with hooks and types of webpack
   * @param options {Object}
   * @returns {Array}
   * @example
   * [{
   *   hookType: 'tap',
   *   hookName: 'compilation',
   *   jobs: {
   *     compress: []
   *   }
   * }]
   */
  static translateHooks (options) {
    const result = [];
    for (let o in options) {
      if (options.hasOwnProperty(o)) {
        const { hookType, hookName, customHookName = hookName } = this.HOOKS_MAP[o];
        result.push({
          hookType,
          hookName,
          customHookName,
          jobs: options[o]
        });
      }
    }
    return result;
  }
  
  /**
   * @desc check whether hook of 'option' is valid
   * @param options {Object}
   */
  static checkHooks (options) {
    const possibleLifeTypes = Object.keys(options);
    const isValid = possibleLifeTypes.every(type => this.USER_VALID_HOOKS.includes(type));
    if (!isValid) {
      throw new Error('Not valid hooks of webpack.');
    }
  }
  
  apply (compiler) {
    FileManagerPlugin.checkHooks(this.options);
  
    const options = FileManagerPlugin.translateHooks(this.options);
  
    for (const hookItem of options) {
      const { hookType, hookName, jobs, customHookName } = hookItem;
      if (hookType === 'tap') {
        compiler.hooks[hookName][hookType](customHookName, async () => {
          info(`start: tap ${customHookName}`);
          await FileManagerPlugin.handlerJobs(jobs);
          info(`waiting: ${customHookName}`);
          await FileManagerPlugin.sleep(3);
          info(`finish: ${customHookName}`);
        });
      } else if (hookType === 'tapAsync') {
        compiler.hooks[hookName][hookType](customHookName, async (compilation, callback) => {
          info(`start: tapAsync ${customHookName}`);
          await FileManagerPlugin.handlerJobs(jobs);
          info(`waiting: ${customHookName}`);
          await FileManagerPlugin.sleep(3);
          info(`finish: ${customHookName}`);
          callback();
        });
      }
    }
  }
}

export default FileManagerPlugin;