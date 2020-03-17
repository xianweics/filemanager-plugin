const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import * as path from 'path';
import copy from '../src/command/copy';
describe('test copy', () => {
  let copyData;
  let BASE_URL;
  beforeEach(() => {
    BASE_URL = path.join(__dirname, '../');
    copyData = {
      source: BASE_URL + '/example/webpack/copy/a/index.html',
      destination: BASE_URL + '/example/webpack/copy/a/copy.html'
    };
  });
  // remove file
  afterEach(() => {
    fs.removeSync(copyData.destination);
  });
  it('test checkCopy method', () => {
    copy(
      { source: copyData.source, destination: copyData.destination },
      {}
    ).then(() => {
      expect(fs.pathExistsSync(copyData.destination)).to.be.ok;
    });
  });
});
