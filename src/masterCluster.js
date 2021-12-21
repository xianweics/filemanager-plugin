const os = require('os');
const { join } = require('path');
const cluster = require('cluster');
const { logger } = require('./utils');

function masterCluster({
  jobs,
  type,
  cpu
}, options) {
  return new Promise((resolve, reject) => {
    (cluster.setupMaster || cluster.setupPrimary)({
      exec: join(__dirname, 'workerCluster.js'),
      silent: false
    });
    if (cluster.isMaster || cluster.isPrimary) {
      const workerID = [];
      let countCompleted = 0;
      let forkCount = 0;
      let maxCpu = getMaxCup(cpu, jobs.length);
      while (forkCount < maxCpu) {
        const wk = cluster.fork();
        workerID.push(wk.id);
        wk.send({
          job: jobs[forkCount++],
          type,
          options
        });
      }
      cluster.on('error', (e) => {
        logger.error(`[master] error:  ${e}`);
        reject(e);
      });
      workerID.forEach((id) => {
        cluster.workers[id].on('message', function () {
          countCompleted++;
          const jobsLength = jobs.length;
          if (forkCount < jobsLength) {
            this.send({
              job: jobs[forkCount++],
              type,
              options
            });
          }
          if (countCompleted === jobsLength) {
            workerID.forEach((id) => {
              if (!cluster.workers[id].isDead()) {
                cluster.workers[id].disconnect();
              }
            });
            resolve(countCompleted);
          }
        });
      });
    }
  });
}

function getMaxCup(cpu, jobsLength) {
  let maxCpu = os.cpus().length - 1;
  if (cpu && !isNaN(cpu) && cpu > 0) {
    maxCpu = Math.min(Number(cpu), maxCpu);
  }
  return Math.min(maxCpu, jobsLength);
}

module.exports = masterCluster;
