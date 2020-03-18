const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import copy from '../../src/command/copy';

describe('test copy', () => {
  let mockData;
  beforeEach(() => {
    const mockFileUrl = path.join(__dirname, '../mockFiles/');
    mockData = {
      source: mockFileUrl + 'index.html',
      destination: mockFileUrl + 'copy.html'
    };
  });
  // remove temp file
  afterEach(() => {
    fs.removeSync(mockData.destination);
  });
  it('file is exist', async () => {
    await copy({ source: mockData.source, destination: mockData.destination }, {});
    expect(fs.pathExistsSync(mockData.destination)).to.be.true;
  });
});
