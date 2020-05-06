const cluster = require('cluster');
const cpuLength = require('os').cpus().length;

function excuFibo(jobs) {
  return new Promise((resolve, reject) => {
    const result = [];
    let forkCount = 0;
    const maxCpu = Math.min(cpuLength, jobs.length);
    const workerID = [];
    cluster.setupMaster({
      exec: 'worker.js',
      slient: true
    });
    while (forkCount < maxCpu) {
      const wk = cluster.fork();
      workerID.push(wk.id);
      wk.send(jobs[forkCount++]);
    }
    
    cluster.on('fork', (worker) => {
      if (workerID.includes(worker.id)) return;
      console.log(`[master] : fork worker ${worker.id}`);
    });
    cluster.on('exit', (worker, code, signal) => {
      console.log(
        `[master] : worker ${worker.id} died, code: ${code}, signal: ${signal}`);
    });
    cluster.on('error', (e) => {
      console.log(`[master] : error ${e}`);
      reject(e);
    });
    Object.keys(cluster.workers).forEach((id) => {
      cluster.workers[id].on('message', function (msg) {
        console.log(`[master] receive message from [worker ${id}]: ${msg}`);
        result.push(msg);
        const curFinishJobLength = result.length;
        const jobsLength = jobs.length;
        // if (forkCount < jobsLength) {
        //   this.send(jobs[forkCount]);
        //   forkCount++;
        // }
        if (curFinishJobLength >= jobsLength) {
          workerID.forEach((id) => {
            console.info(cluster.workers[id].state,
              cluster.workers[id].isDead());
            // if (!cluster.workers[id].suicide) {
            //   cluster.workers[id].disconnect();
            // }
          });
          resolve(result);
        }
      });
    });
  });
}

module.exports = excuFibo;