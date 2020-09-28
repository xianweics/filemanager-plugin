const fs = require('fs-extra');
const path = require('path');

const template = (name, desc) => {
  const rootPath = path.join(__dirname, '..', 'testCache');
  describe(name, () => {
    afterEach(() => {
      fs.removeSync(rootPath);
    });
    
    beforeEach(() => {
      fs.removeSync(rootPath);
    });
    desc(rootPath);
  });
};

export {
  template
};
