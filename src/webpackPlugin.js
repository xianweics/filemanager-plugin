import * as commander from './commander';
const COMMAND_LIST = ['copy', 'move', 'del', 'zip', 'unzip', 'rename'];
const NAMESPACE_REGISTER_NAME = 'REGISTER_';
const BUILTIN_EVENTS_MAP = {
  'start': {
    hookType: 'tapAsync',
    hookName: 'beforeRun',
    registerName: NAMESPACE_REGISTER_NAME + 'beforeRun'
  },
  'end': {
    hookType: 'tapAsync',
    hookName: 'afterEmit',
    registerName: NAMESPACE_REGISTER_NAME + 'afterEmit'
  }
};
const BUILTIN_EVENT_NAMES = Object.keys(BUILTIN_EVENTS_MAP);

class webpackPlugin {
  /**
   * @desc execute according command type
   * @param commands {Object}
   * @param globalOptions {Object}
   * @returns {Promise<void>}
   */
  static async handleCommand (commands, globalOptions) {
    for (const command in commands) {
      if (commands.hasOwnProperty(command) &&
        COMMAND_LIST.includes(command)) {
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
   * @example
   * [
   * {
   *   hookType: 'tapAsync', // reference to webpack compiler hook type
   *   hookName: 'afterEmit', // reference to webpack compiler hook name
   *   registerName: 'REGISTER_afterEmit',
   *   commands: {
   *     del: {
   *       items: [
   *          { source: './unzip/a.tar', destination: './dist/unzip/a', type: 'tar', options: {}},
   *       ],
   *       options: {
   *         before: () => {}
   *       }
   *     }
   *   }
   * }
   * ]
   */
  static translateHooks (opts) {
    const { events = {}, customHooks = [], options: globalOptions = {}} = opts;
    let result = [];
    if (customHooks.length > 0) {
      result = customHooks.map(hook => {
        const { registerName, hookName } = hook;
        if (!registerName) hook.registerName = NAMESPACE_REGISTER_NAME + hookName;
        return hook;
      });
    } else {
      for (const event in events) {
        if (events.hasOwnProperty(event) &&
          BUILTIN_EVENT_NAMES.includes(event)) {
          const commands = events[event];
          if (!commands) continue;
          const { hookType, hookName, registerName } = BUILTIN_EVENTS_MAP[event];
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
  
  /**
   * check input hook whether match webpack hook type
   * @param hook {Object}
   * @returns {boolean}
   */
  static checkCustomHook (hook) {
    return true;
  }
  
  /**
   * @desc the type of tap hook callback
   * @param commands {Array}
   * @param options {Object}
   * @returns {Function}
   */
  static tabCallback (commands, options) {
    return async () => {
      await webpackPlugin.handleCommand(commands, options);
    };
  }
  
  /**
   * the type of tapAsync hook callback
   * @param commands {Array}
   * @param options {Object}
   * @returns {Function}
   */
  static tapAsyncCallback (commands, options) {
    return async (compilation, callback) => {
      await webpackPlugin.handleCommand(commands, options);
      callback();
    };
  }
}

export default webpackPlugin;
