async function job2(num) {
  // await new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 2000);
  // });
  return num * 10;
}

module.exports = job2;