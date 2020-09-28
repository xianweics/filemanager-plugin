import { logger } from './utils';
import { handleCommand } from './handler';

const NAMESPACE_REGISTER_NAME = 'REGISTER_';
const BUILTIN_EVENTS_MAP = {
  start: {
    hookType: 'tapAsync',
    hookName: 'beforeCompile',
    registerName: NAMESPACE_REGISTER_NAME + 'beforeCompile',
  },
  end: {
    hookType: 'tapAsync',
    hookName: 'done',
    registerName: NAMESPACE_REGISTER_NAME + 'done',
  },
};
const BUILTIN_EVENT_NAMES = Object.keys(BUILTIN_EVENTS_MAP);
const SUPPORT_HOOKS_TYPE = ['tap', 'tapPromise', 'tapAsync'];

class webpackPlugin {
  constructor(opts) {
    this.opts = {};
    if (Object.prototype.toString.call(opts) === '[object Object]') {
      this.opts = opts;
    }
  }

  /**
   * @description runs according to different operates like delete, when different hooks called
   * @param commands {object}
   * @returns {function}
   */
  hooksRegisterCallback(commands) {
    return async (compilation, callback) => {
      await handleCommand(commands, this.opts?.options);
      callback && callback();
    };
  }

  /**
   * @description translate 'options' to other options with hooks and types of webpack
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
   *       ]
   *     }
   *   }
   * }
   * ]
   */
  translateHooks() {
    const { events = {}, customHooks = [] } = this.opts;
    let result = [];
    if (customHooks.length > 0) {
      result = customHooks.map((hook) => {
        const { registerName, hookName } = hook;
        if (!registerName) {
          hook.registerName = NAMESPACE_REGISTER_NAME + hookName;
        }
        return hook;
      });
    } else {
      for (const event in events) {
        if (
          events.hasOwnProperty(event) &&
          BUILTIN_EVENT_NAMES.includes(event) &&
          events[event]
        ) {
          result.push({
            ...BUILTIN_EVENTS_MAP[event],
            commands: events[event],
          });
        }
      }
    }
    return result;
  }

  apply(compiler) {
    const options = this.translateHooks();
    for (const hookItem of options) {
      const { hookType, hookName, commands, registerName } = hookItem;
      if (!SUPPORT_HOOKS_TYPE.includes(hookType)) continue;
      try {
        compiler.hooks[hookName][hookType](
          registerName,
          this.hooksRegisterCallback(commands)
        );
      } catch (e) {
        logger.error(`File manager error: ${e}`);
      }
    }
  }
}

export default webpackPlugin;
