const commander = require('./commander');

process.on('message', async (msg) => {
  const {
    job,
    type,
    options
  } = msg;
  await commander[type](job, options);
  process.send('done');
});
