const fs = require('fs-extra');

const template = (name, desc) => {
  const rootPath = 'testCache';
  describe(name, () => {
    after(() => {
      fs.removeSync(rootPath);
    });
    
    before(() => {
      fs.removeSync(rootPath);
    });
    desc(rootPath);
  });
};

export {
  template
};