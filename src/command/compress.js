const compressing = require('compressing');
const fs = require('fs');

const compress = async (src, dest, compressType = 'zip') => {
  const fileDesc = fs.statSync(src);
  const isDirectory = fileDesc.isDirectory();
  let fileType = 'compressFile';
  if (isDirectory) {
    fileType = 'compressDir';
  }
  
  await compressing[compressType][fileType](src, dest)
    .then(() => {
      console.log(`Succeed in compressing '${src}' to '${dest}'.`);
    })
    .catch(() => {
      console.log(`Fail to compress '${src}' to '${dest}'`);
    });
};

export default compress;