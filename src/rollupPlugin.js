import * as commander from './commander';
import { checkType } from './utils';

const COMMAND_LIST = ['copy', 'move', 'del', 'zip', 'unzip', 'rename'];
const BASE_HOOKS = ['buildStart', 'generateBundle'];
const EVENT_NAMES_MAP = {
  start: {
    hook: BASE_HOOKS[0]
  },
  end: {
    hook: BASE_HOOKS[1]
  }
};
const EVENT_NAMES = Object.keys(EVENT_NAMES_MAP);

/**
 * @description extract BASE_HOOKS's events and custom hooks
 * @param opts {Object}
 * @returns {Object}
 * @example
 * [
 *    {
 *      buildStart: {} | [],
 *      generateBundle: {} | []
 *    },
 *    [{...}, {....}]?
 * ]
 */
function extractEvents(opts) {
  const { events, customHooks = [] } = opts;
  const result = {};
  const custHooks = [];
  if (customHooks.length > 0) {
    for (const hook of customHooks) {
      const { hookName, commands } = hook;
      if (BASE_HOOKS.includes(hookName)) {
        result[hookName] = result[hookName] || [];
        result[hookName].push(commands);
      } else {
        custHooks.push(hook);
      }
    }
  }
  for (const event in events) {
    if (events.hasOwnProperty(event) && EVENT_NAMES.includes(event)) {
      let hookEvent = result[EVENT_NAMES_MAP[event].hook];
      if (hookEvent) {
        hookEvent.push(events[event]);
      } else {
        result[EVENT_NAMES_MAP[event].hook] = events[event];
      }
    }
  }
  return [result, custHooks];
}

/**
 * @description execute according command type
 * @param commands {Object | Array}
 * @returns {void}
 */
async function commanderDone(commands) {
  if (checkType.isArray(commands)) {
    // commands may be an array
    if (commands.length <= 0) return null;
    for (const command of commands) {
      commanderDone(command);
    }
    return null;
  }
  for (const command in commands) {
    if (commands.hasOwnProperty(command) && COMMAND_LIST.includes(command)) {
      const { items, options } = commands[command];
      for (const item of items) {
        await commander[command](item, options);
      }
    }
  }
}

/**
 * @description Handle user-defined hooks and encapsulate them as asynchronous functions
 * @param customHooks {Array}
 * @returns {Object<Promise>}
 */
function extractCustomHooks(customHooks) {
  const custHooks = {};
  if (customHooks.length < 1) return custHooks;
  for (const hook of customHooks) {
    const { hookName, commands } = hook;
    custHooks[hookName] = async function () {
      await commanderDone(commands);
    };
  }
  return custHooks;
}

function rollupPlugin(opts) {
  const [res, custHooks] = extractEvents(opts);
  return {
    name: 'file-manager',
    async buildStart() {
      await commanderDone(res[BASE_HOOKS[0]]);
    },
    async generateBundle() {
      await commanderDone(res[BASE_HOOKS[1]]);
    },
    ...extractCustomHooks(custHooks)
  };
}

export default rollupPlugin;
