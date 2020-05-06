const cluster = require('cluster');

function fibo(n) {
  return n === 0 ? 0 : n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

process.on('message', async (msg) => {
  const st = Date.now();
  const result = fibo(msg);
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  console.log(
    `[worker ${cluster.worker.id}] finish work and using ${Date.now() - st} ms, result: ${result}`);
  process.send(result);
});