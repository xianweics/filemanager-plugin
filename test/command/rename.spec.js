const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import rename from '../../src/commander/rename';

describe('test rename', () => {
  let mockData;
  beforeEach(() => {
    const mockFileUrl = path.join(__dirname, '../mockFiles/rename/');
    mockData = {
      path: mockFileUrl,
      oldName: 'index.html',
      newName: 'rename.html',
      copyName: 'copy.html'
    };
    fs.copySync(
      mockData.path + mockData.oldName,
      mockData.path + mockData.copyName
    );
  });
  // remove temp file
  afterEach(() => {
    fs.removeSync(mockData.path + mockData.newName);
  });
  it('file is rename', async () => {
    await rename({
      path: mockData.path,
      oldName: mockData.copyName,
      newName: mockData.newName
    });
    expect(fs.pathExistsSync(mockData.path + mockData.newName)).to.be.true;
  });
});
