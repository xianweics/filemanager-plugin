export const webpackRunner = (compiler) =>
  new Promise(resolve => {
    compiler.run((err, stats) => resolve(stats));
  }).catch(console.error);
