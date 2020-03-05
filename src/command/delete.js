const fs = require('fs');

const del = function (path) {
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      deleteDir(path);
    } else {
      try {
        fs.unlinkSync(path);
        console.info(`Succeed to delete ${path}`);
      } catch (error) {
        console.error(`Fail to delete ${path}`);
      }
    }

  } else {
    throw Error('path is not find');
  }
};

function deleteDir (path) {
  let files = fs.readdirSync(path);
  files.forEach(function (file) {
    let curPath = path + '/' + file;
    if (fs.statSync(curPath).isDirectory()) {
      del(curPath);
    } else {
      try {
        fs.unlinkSync(curPath);
        console.info(`Succeed to delete ${curPath}`);
      } catch (error) {
        console.error(`Fail to delete ${curPath}`);
      }
    }
  });
  try {
    fs.rmdirSync(path);
    console.info(`Succeed to delete ${path}`);
  } catch (error) {
    console.error(`Fail to delete ${path}`);
  }
}

export default del;
