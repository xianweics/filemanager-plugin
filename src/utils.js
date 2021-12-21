const colors = require('colors/safe');
const isTest = process.env.NODE_ENV === 'test';
const log = console.log;
const DEFAULT_TYPE = 'all';

const logger = {
  BUILTIN_LOGS: ['all', 'error'],
  type: DEFAULT_TYPE,
  
  setType(type) {
    this.type = this.BUILTIN_LOGS.includes(type) ? type : DEFAULT_TYPE;
    return this;
  },
  info(msg) {
    if (isTest || this.type !== 'all') return;
    log(colors.green(msg));
  },
  error(msg) {
    if (isTest) return;
    log(colors.red(msg));
    process.exitCode = 1;
  }
};

const flat = (arr) => {
  return arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : [cur]),
    []
  );
};

/**
 * @description singleton mode
 * @returns {function}
 */
const cacheSingle = (() => {
  let instance = null;
  const obj = {};
  return () => {
    instance = instance || obj;
    return instance;
  };
})();

module.exports.logger = logger;
module.exports.flat = flat;
module.exports.cacheSingle = cacheSingle;
