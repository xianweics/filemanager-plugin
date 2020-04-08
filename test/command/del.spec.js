const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import del from '../../src/commander/del';
import copy from '../../src/commander/copy';


describe('test delete', () => {
  let mockData;
  beforeEach(() => {
    const mockFileUrl = path.join(__dirname, '../mockFiles/');
    mockData = {
      source: mockFileUrl + 'index.html',
      destination: mockFileUrl + 'deleteFile'
    };
    copy({ source: mockData.source, destination: mockData.destination }, {});
  });
  it('file is delete', async () => {
    del({ source: mockData.destination });
    expect(fs.pathExistsSync(mockData.destination)).to.be.false;
  });
});
