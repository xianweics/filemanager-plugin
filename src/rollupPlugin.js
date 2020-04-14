import * as commander from './commander';

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
 * @description extract BASE_HOOKS's events and custom hooks
 * @param opts {Object}
 * @returns {Array}
 * @example
 * [
 *    {
 *      buildStart: {},
 *      generateBundle: {}
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
      custHooks.push(hook);
    }
  }
  for (const event in events) {
    if (events.hasOwnProperty(event) && EVENT_NAMES.includes(event)) {
      result[EVENT_NAMES_MAP[event].hook] = events[event];
    }
  }
  return [result, custHooks];
}

/**
 * @description execute according command type
 * @param commands {Object}
 * @returns {void}
 */
async function commanderDone(commands) {
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
      await commanderDone(res[EVENT_NAMES_MAP.start.hook]);
    },
    async generateBundle() {
      await commanderDone(res[EVENT_NAMES_MAP.end.hook]);
    },
    ...extractCustomHooks(custHooks)
  };
}

export default rollupPlugin;
