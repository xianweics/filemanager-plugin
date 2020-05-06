const fs = require('fs-extra');
const path = require('path');

const template = (name, desc) => {
  const rootPath = path.join(__dirname, '..', 'testCache');
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
