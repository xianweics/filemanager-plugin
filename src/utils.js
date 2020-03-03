const colors = require('colors/safe');
const log = console.log;

export function handlerError (msg) {
  log(colors.red(msg));
  process.exitCode = 1;
}

export function handlerInfo (msg) {
  log(colors.green(msg));
}

export function handlerWarn (msg) {
  log(colors.yellow(msg));
}

export function printDebug (msg) {
  log(colors.blue(msg));
}
