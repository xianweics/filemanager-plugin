const os = require('os');
const cluster = require('cluster');

function master({ jobs, type, cpu }) {
  let maxCpu = getMaxCup(cpu, jobs.length);
  return new Promise((resolve, reject) => {
    cluster.setupMaster({
      exec: 'worker.js',
      silent: false
    });
    if (cluster.isMaster) {
      const workerID = [];
      const result = [];
      let forkCount = 0;
      while (forkCount < maxCpu) {
        const wk = cluster.fork();
        workerID.push(wk.id);
        wk.send([jobs[forkCount++], type]);
      }
      cluster.on('error', (e) => {
        console.log(`[master] error:  ${e}`);
        reject(e);
      });
      workerID.forEach((id) => {
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

function getMaxCup(cpu, jobsLength) {
  let maxCpu = (os.cpus()).length - 1;
  if (cpu && !isNaN(cpu) && cpu > 0) {
    maxCpu = Math.min(Number(cpu), maxCpu);
  }
  return Math.min(maxCpu, jobsLength);
}

module.exports = master;