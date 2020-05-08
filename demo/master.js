const cpus = require('os').cpus();
const cluster = require('cluster');

function excuFibo({ jobs, type }) {
  return new Promise((resolve, reject) => {
    const result = [];
    let forkCount = 0;
    const maxCpu = Math.min(cpus.length, jobs.length);
    const workerID = [];
    cluster.setupMaster({
      exec: 'worker.js',
      silent: false
    });
    if (cluster.isMaster) {
      while (forkCount < maxCpu) {
        const wk = cluster.fork();
        workerID.push(wk.id);
        wk.send([jobs[forkCount++], type]);
      }
      cluster.on('error', (e) => {
        console.log(`[master] error:  ${e}`);
        reject(e);
      });
      Object.keys(cluster.workers).forEach((id) => {
        cluster.workers[id].on('message', function (msg) {
          console.log(`[master] receive message from [worker ${id}]: ${msg}`);
          result.push(msg);
          const jobsLength = jobs.length;
          if (forkCount < jobsLength) {
            this.send([jobs[forkCount], type]);
            forkCount++;
          }
          if (result.length === jobsLength) {
            workerID.forEach((id) => {
              if (!cluster.workers[id].isDead()) {
                cluster.workers[id].disconnect();
              }
            });
            resolve(result);
          }
        });
      });
    }
  });
}

module.exports = excuFibo;