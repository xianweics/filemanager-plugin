const commander = require('./commander');

process.on('message', async (msg) => {
  const { job, type, options } = msg;
  const result = (await commander[type](job, options)) || true;
  process.send(result);
});
