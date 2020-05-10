const master = require('./master');

async function start() {
  const arr = [];
  for (let i = 0; i <= 17; i++) {
    arr.push(i);
  }
  const result1 = master({
    jobs: arr,
    type: 'job1',
    cpu: 8
  });
  const result2 = master({
    jobs: arr.map(item => item * item),
    type: 'job2'
  });
  const result3 = master({
    jobs: [31, 32, 33, 34],
    type: 'job2',
    cpu: 1
  });
  result1.then(console.log);
  result2.then(console.log);
  result3.then(console.log);
}

start();