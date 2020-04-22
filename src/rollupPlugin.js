import commander from './commander';

const COMMAND_LIST = ['copy', 'move', 'del', 'zip', 'unzip', 'rename'];
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
function extractHooks(opts) {
  const { events, customHooks = [] } = opts;
  const hooks = [];
  if (customHooks.length > 0) {
    for (const hook of customHooks) {
      hooks.push(hook);
    }
  } else {
    for (const event in events) {
      if (events.hasOwnProperty(event) && EVENT_NAMES.includes(event)) {
        hooks.push({
          hookName: EVENT_NAMES_MAP[event].hook,
          commands: events[event]
        });
      }
    }
  }
  return hooks;
}

/**
 * @description execute according command type
 * @param commands {Object}
 * @returns {void}
 */
async function commanderDone(commands) {
  if (commands && Object.keys(commands).length > 0) {
    for (const command in commands) {
      if (commands.hasOwnProperty(command) && COMMAND_LIST.includes(command)) {
        const { items, options } = commands[command];
        for (const item of items) {
          await commander[command](item, options);
        }
      }
    }
  }
}

/**
 * @description Create each hook method
 * @param hooks {Array}
 * @returns {Object<Promise>}
 */
function createHooks(hooks) {
  const hookObj = {};
  if (hooks.length < 1) return hookObj;
  for (const hook of hooks) {
    const { hookName, commands } = hook;
    hookObj[hookName] = async function () {
      await commanderDone(commands);
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

rollupPlugin.extractHooks = extractHooks;
rollupPlugin.commanderDone = commanderDone;
rollupPlugin.createHooks = createHooks;
export default rollupPlugin;
