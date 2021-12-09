import { handleCommand } from './handler';

const EVENT_NAMES_MAP = {
  start: 'buildStart',
  end: 'buildEnd'
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
  const {
    events = {},
    customHooks = [],
    options: globalOptions = {}
  } = opts;
  let hooks = [];
  if (customHooks.length > 0) {
    hooks = customHooks.map((hook) => {
      hook.globalOptions = globalOptions;
      return hook;
    });
  } else {
    for (const event in events) {
      if (events.hasOwnProperty(event) && EVENT_NAMES.includes(event)) {
        hooks.push({
          hookName: EVENT_NAMES_MAP[event],
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
  return hooks.reduce((pre, cur) => {
    const {
      hookName,
      commands,
      globalOptions
    } = cur;
    pre[hookName] = async () => {
      await handleCommand(commands, globalOptions);
    };
    return pre;
  }, {});
}

function rollupPlugin(opts) {
  if (Object.prototype.toString.call(opts) !== '[object Object]') return;
  return {
    name: 'file-manager',
    ...createHooks(extractHooks(opts))
  };
}

export default rollupPlugin;
