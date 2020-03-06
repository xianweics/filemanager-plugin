import * as command from './command';
import { checkType, handlerError, printDebug, sleep } from './utils';

const preErrorNotice = 'file manager error:';

class FileManagerPlugin {
  static HOOK_NAME = 'FileManagerPlugin';
  // static VALID_COMMANDS = ['copy', 'move', 'del', 'zip', 'unzip', 'rename'];
  static VALID_COMMANDS = ['copy'];
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
  static USER_VALID_LIFE_HOOKS = Object.keys(this.HOOKS_MAP);

  constructor (opts) {
    this.options = opts;
  }

  /**
   * @desc execute according jobs type
   * @param jobs {Object}
   * @returns {Promise<void>}
   */
  static async handlerJobs (jobs) {
    for (const job of Object.entries(jobs)) {
      const [type, arr] = job;
      for (const item of arr) {
        await command[type](item);
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
    for (const o in options) {
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
   * @desc check the 'option' input which comes from user
   * @param options {Object}
   */
  static checkInput (options) {
    try {
      if (!checkType.isObject(options)) {
        handlerError(`${preErrorNotice} the input is not valid`);
      }

      for (const lifeHook in options) {
        if (options.hasOwnProperty(lifeHook)) {
          if (!this.USER_VALID_LIFE_HOOKS.includes(lifeHook)) {
            handlerError(`${preErrorNotice} ${lifeHook} is not found`);
          }
          const jobs = options[lifeHook];
          if (!checkType.isObject(jobs)) {
            handlerError(`${preErrorNotice} the input is not valid`);
          }
          if (Object.keys(jobs).length === 0) {
            continue;
          }
          for (const job of Object.entries(jobs)) {
            const [commandType, commandQueue] =  job;
            if (!this.VALID_COMMANDS.includes(commandType) || !checkType.isArray(commandQueue)) {
              handlerError(`${preErrorNotice} the input is not valid`);
            }
            for (const cq of commandQueue) {
              // eslint-disable-next-line max-depth
              if (!checkType.isObject(cq)) {
                handlerError(`${preErrorNotice} the input is not valid`);
              }
            }
          }
        }
      }
    } catch (e) {
      handlerError(`${preErrorNotice} ${e}`);
    }
  }

  apply (compiler) {
    FileManagerPlugin.checkInput(this.options);

    const options = FileManagerPlugin.translateHooks(this.options);

    for (const hookItem of options) {
      const { hookType, hookName, jobs, customHookName } = hookItem;
      if (hookType === 'tap') {
        compiler.hooks[hookName][hookType](customHookName, async () => {
          printDebug(`start: tap ${customHookName}`);
          await FileManagerPlugin.handlerJobs(jobs);
          printDebug(`waiting: ${customHookName}`);
          await sleep(1);
          printDebug(`finish: ${customHookName}`);
        });
      } else if (hookType === 'tapAsync') {
        compiler.hooks[hookName][hookType](customHookName,
          async (compilation, callback) => {
            printDebug(`start: tapAsync ${customHookName}`);
            await FileManagerPlugin.handlerJobs(jobs);
            printDebug(`waiting: ${customHookName}`);
            await sleep(3);
            printDebug(`finish: ${customHookName}`);
            callback();
          });
      }
    }
  }
}

export default FileManagerPlugin;