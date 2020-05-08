const excuFibo = require('./master');

async function start() {
  const arr = [];
  for (let i = 0; i <= 200; i++) {
    arr.push(i);
  }
  const result1 = await excuFibo({
    jobs: arr,
    type: 'job1'
  });
  const result2 = await excuFibo({
    jobs: [31, 32, 33, 34],
    type: 'job2'
  });
  console.log('result1: ' + result1, 'result length:' + result1.length,
    'initial length:' + arr.length);
  console.log('result2: ' + result2);
}

start();

// https://www.ibm.com/developerworks/cn/opensource/os-cn-nodejs-practice/