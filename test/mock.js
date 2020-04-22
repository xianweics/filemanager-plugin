import * as srcUtils from '../src/utils';

const fs = require('fs-extra');
const sinon = require('sinon');

const template = (name, callback) => {
  const rootPath = 'testCache';
  describe(name, () => {
    after(() => {
      fs.removeSync(rootPath);
    });
    
    before(() => {
      fs.removeSync(rootPath);
    });
    callback(rootPath);
  });
};

const handlerError = sinon.stub(srcUtils, 'handlerError').callsFake();
const handlerInfo = sinon.stub(srcUtils, 'handlerInfo').callsFake();

const utils = {
  handlerError,
  handlerInfo
};

export {
  utils,
  template
};