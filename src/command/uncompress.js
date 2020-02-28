const compressing = require('compressing');

const uncompress = async (src, dest, type = 'zip') => {
  await compressing[type].uncompress(src, dest)
    .then(() => {
      console.log(`${src} uncompress to ${dest} successfully.`);
    })
    .catch(() => {
      console.error(`error: ${src} uncompress to ${dest}`);
    });
};

export default uncompress;