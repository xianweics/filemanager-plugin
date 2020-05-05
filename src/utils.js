const colors = require('colors/safe');
const isTest = process.env.NODE_ENV === 'test';
const log = console.log;
const DEFAULT_TYPE = 'all';

export const logger = {
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
