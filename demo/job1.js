async function job1(num) {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
  return num;
}

module.exports = job1;