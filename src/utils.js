const colors = require('colors/safe');
const isTest = process.env.NODE_ENV === 'test';

export const log = console.log;

export function handlerError(msg) {
  if (isTest) return;
  log(colors.red(msg));
  process.exitCode = 1;
}

export function handlerInfo(msg) {
  log(colors.green(msg));
}

export const checkType = (() => {
  const types = [
    'Object',
    'Array',
    'String',
    'Undefined',
    'Null',
    'Number',
    'Function'
  ];
  const result = {};
  for (let type of types) {
    result['is' + type] = item =>
      ({}.toString.call(item) === `[object ${type}]`);
  }
  return result;
})();

export function sleepAsync(time, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb && cb();
      resolve();
    }, time * 1000);
  });
}

export function sleepSync(time, cb) {
  const exitTime = new Date().getTime() + time * 1000;
  while (true) {
    if (new Date().getTime() > exitTime) {
      cb && cb();
      return;
    }
  }
}
