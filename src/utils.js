const colors = require('colors/safe');
const isTest = process.env.NODE_ENV === 'test';
const log = console.log;

export function handlerError(msg) {
  if (isTest) return;
  log(colors.red(msg));
  process.exitCode = 1;
}

export function handlerInfo(msg) {
  if (isTest) return;
  log(colors.green(msg));
}
