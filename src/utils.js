const colors = require('colors/safe');

const log = console.log;

export function handlerError (msg) {
  log(colors.red(msg));
  process.exit();
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

export const checkType = (() => {
  const types = ['Object', 'Array', 'String', 'Undefined', 'Null', 'Number', 'Function'];
  const result = {};
  for (let type of types) {
    result['is' + type] = (item) => ({}).toString.call(item) === `[object ${type}]`;
  }
  return result;
})();

export function sleep (time, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb && cb();
      resolve();
    }, time * 1000);
  });
}
