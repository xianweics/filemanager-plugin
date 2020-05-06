const excuFibo = require('./master');

const collection = [
  4,
  12,
  12,
  13,
  2];

async function start() {
  const result1 = excuFibo(collection);
  const result2 = excuFibo(collection);
  await result1;
  await result2;
  console.log('result: ' + result1);
  console.log('result: ' + result2);
}

start();

// https://www.ibm.com/developerworks/cn/opensource/os-cn-nodejs-practice/