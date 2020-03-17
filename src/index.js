import * as commander from './command';

class FileManagerPlugin {
  static HOOK_NAME = 'FileManagerPlugin';
  static COMMAND_LIST = ['copy', 'move', 'del', 'zip', 'unzip', 'rename'];
  static NAMESPACE_REGISTER_NAME = 'REGISTER_';
  static BUILTIN_EVENTS_MAP = {
    'start': {
      hookType: 'tapAsync',
      hookName: 'beforeRun',
      registerName: this.NAMESPACE_REGISTER_NAME + 'beforeRun'
    },
    'end': {
      hookType: 'tapAsync',
      hookName: 'afterEmit',
      registerName: this.NAMESPACE_REGISTER_NAME + 'afterEmit'
    }
  };
  static BUILTIN_EVENT_NAMES = Object.keys(this.BUILTIN_EVENTS_MAP);
  
  constructor (opts) {
    this.options = opts;
  }
  
  /**
   * @desc execute according command type
   * @param commands {Object}
   * @param globalOptions {Object}
   * @returns {Promise<void>}
   */
  static async handleCommand (commands, globalOptions) {
    for (const command in commands) {
      if (commands.hasOwnProperty(command) &&
        this.COMMAND_LIST.includes(command)) {
        let { items = [], options = {}} = commands[command];
        options = Object.assign(options, globalOptions);
        for (const item of items) {
          await commander[command](item, options);
        }
      }
    }
  }
  
  /**
   * @description translate 'options' to other options with hooks and types of webpack
   * @param opts {Object}
   * @returns {Array}
   */
  static translateHooks (opts) {
    const { events = {}, customWebpackHooks = [], options: globalOptions = {}} = opts;
    const result = [];
    if (customWebpackHooks.length > 0) {
      // transfer
    } else {
      for (const event in events) {
        if (events.hasOwnProperty(event) &&
            this.BUILTIN_EVENT_NAMES.includes(event)) {
          const commands = events[event];
          if (!commands) continue;
          const { hookType, hookName, registerName = hookName } = this.BUILTIN_EVENTS_MAP[event];
          result.push({
            hookType,
            hookName,
            registerName,
            commands,
            globalOptions
          });
        }
      }
    }
    return result;
  }
  
  apply (compiler) {
    const options = FileManagerPlugin.translateHooks(this.options);
    
    for (const hookItem of options) {
      const { hookType, hookName, commands, registerName, globalOptions } = hookItem;
      if (hookType === 'tap') {
        compiler.hooks[hookName][hookType](registerName, async () => {
          // printDebug(`start: tap ${registerName}`);
          // await sleepAsync(1);
          await FileManagerPlugin.handleCommand(commands, globalOptions);
          // printDebug(`waiting: ${registerName}`);
          // await sleep(0);
          // printDebug(`finish: ${registerName}`);
        });
      } else if (hookType === 'tapAsync') {
        compiler.hooks[hookName][hookType](registerName,
          async (compilation, callback) => {
            console.info(hookName, hookType);
            // printDebug(`start: tapAsync ${registerName}`);
            await FileManagerPlugin.handleCommand(commands, globalOptions);
            // printDebug(`waiting: ${registerName}`);
            // printDebug(`finish: ${registerName}`);
            // await sleepAsync(3);
            callback();
          });
      }
    }
  }
}

export default FileManagerPlugin;