const os = require('os');
const cluster = require('cluster');
const { join } = require('path');
import { logger } from './utils';

function masterCluster({ jobs, type, cpu }, options) {
  return new Promise((resolve, reject) => {
    cluster.setupMaster({
      exec: join(__dirname, 'workerCluster.js'),
      silent: false
    });
    if (cluster.isMaster) {
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
      cluster.on('error', e => {
        logger.error(`[master] error:  ${e}`);
        reject(e);
      });
      workerID.forEach(id => {
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
            workerID.forEach(id => {
              if (!cluster.workers[id].isDead()) {
                cluster.workers[id].disconnect();
              }
            });
            resolve();
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

export default masterCluster;
