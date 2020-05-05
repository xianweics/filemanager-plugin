const colors = require('colors/safe');
const isTest = process.env.NODE_ENV === 'test';
const log = console.log;

export const logger = {
  info(msg) {
    if (isTest) return;
    log(colors.green(msg));
  },
  error(msg) {
    if (isTest) return;
    log(colors.red(msg));
    process.exitCode = 1;
  }
};
