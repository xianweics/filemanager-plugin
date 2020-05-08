const jobs = {
  'job1': (job) => require('./job1')(job),
  'job2': (job) => require('./job2')(job)
};

process.on('message', async (msg) => {
  const [job, type] = msg;
  const result = await jobs[type](job);
  process.send(result);
});