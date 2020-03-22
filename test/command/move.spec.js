const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import move from '../../src/commander/move';
import copy from '../../src/commander/copy';



describe('test move', () => {
  let mockData;
  beforeEach(() => {
    const mockFileUrl = path.join(__dirname, '../mockFiles/');
    mockData = {
      source: mockFileUrl + 'index.html',
      destination: mockFileUrl + 'copyFile.html',
      moveTarget: mockFileUrl + 'moveFile.html'
    };
    copy({ source: mockData.source, destination: mockData.destination }, {});

  });
  // remove temp file
  afterEach(() => {
    fs.removeSync(mockData.moveTarget);
  });
  it('file is move', async () => {
    await move({source: mockData.destination, destination: mockData.moveTarget});
    expect(fs.pathExistsSync(mockData.moveTarget)).to.be.true;
  });
});
