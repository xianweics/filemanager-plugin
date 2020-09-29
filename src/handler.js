import masterCluster from './masterCluster';
import commander from './commander';

const COMMAND_LIST = ['copy', 'move', 'del', 'zip', 'unzip', 'rename'];
/**
 * @description singleton mode
 * @returns {function}
 */
export const cacheSingle = (() => {
  let instance = null;
  const obj = {};
  return () => {
    instance = instance || obj;
    return instance;
  };
})();

/**
 * @description Execute different actions according to commands,
 * do multi-progress depending on the parallel of the globalOptions parameter
 * @param commands {object}
 * @param globalOptions {object}
 * @returns {Promise<void>}
 */
export async function handleCommand(commands = {}, globalOptions = {}) {
  for (const command in commands) {
    if (commands.hasOwnProperty(command) && COMMAND_LIST.includes(command)) {
      const { items = [], options = {} } = commands[command] || {};

      const opts = Object.assign({}, globalOptions, options);
      const { parallel } = globalOptions;
      const { cache: optCache = true } = opts;
      const content = JSON.stringify(items);
      if (optCache && cacheSingle()[command] === content) continue;

      if (parallel) {
        await masterCluster(
          {
            jobs: items,
            cpu: parallel,
            type: command,
          },
          opts
        );
      } else {
        for (const item of items) {
          await commander[command](item, opts);
        }
      }
      optCache && (cacheSingle()[command] = content);
    }
  }
}
