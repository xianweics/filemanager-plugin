import { handleCommand } from './handler';

const EVENT_NAMES_MAP = {
  start: {
    hook: 'buildStart'
  },
  end: {
    hook: 'generateBundle'
  }
};
const EVENT_NAMES = Object.keys(EVENT_NAMES_MAP);

/**
 * @description Extract hook from 'events' and 'customHooks'
 * @param opts {Object}
 * @returns {Array}
 * @example
 * [
 *    {
 *      hookName: 'buildstart',
 *      commands: {
 *        del: {....}
 *      }
 *    }
 * ]
 */
export function extractHooks(opts) {
  const { events, customHooks = [], options: globalOptions = {} } = opts;
  const hooks = [];
  if (customHooks.length > 0) {
    for (const hook of customHooks) {
      hook.globalOptions = globalOptions;
      hooks.push(hook);
    }
  } else {
    for (const event in events) {
      if (events.hasOwnProperty(event) && EVENT_NAMES.includes(event)) {
        hooks.push({
          hookName: EVENT_NAMES_MAP[event].hook,
          commands: events[event],
          globalOptions
        });
      }
    }
  }
  return hooks;
}

/**
 * @description Create each hook method
 * @param hooks {Array}
 * @returns {Object<Promise>}
 */
export function createHooks(hooks) {
  const hookObj = {};
  if (hooks.length < 1) return hookObj;
  for (const hook of hooks) {
    const { hookName, commands, globalOptions } = hook;
    hookObj[hookName] = async function () {
      await handleCommand(commands, globalOptions);
    };
  }
  return hookObj;
}

function rollupPlugin(opts) {
  const hooks = extractHooks(opts);
  return {
    name: 'file-manager',
    ...createHooks(hooks)
  };
}

export default rollupPlugin;
