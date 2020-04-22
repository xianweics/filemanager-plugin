const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import rename from '../../src/commander/rename';

describe('Test rename', () => {
  const rootPath = 'testCache';
  
  after(() => {
    fs.removeSync(rootPath);
  });
  
  it('Rename a valid file, it will be renamed successfully', async () => {
    const mockOldName = 'index.html';
    const mockNewName = 'index1.html';
    const mockSource = path.join(rootPath, 'rename', mockOldName);
    fs.ensureFileSync(mockSource);
    const mockPath = path.join(rootPath, 'rename');
    const mockDestination = path.join(rootPath, 'rename', mockNewName);
    expect(fs.pathExistsSync(mockSource)).equals(true);
    expect(fs.pathExistsSync(mockDestination)).equals(false);
    await rename({
      path: mockPath,
      oldName: mockOldName,
      newName: mockNewName,
    });
    expect(fs.pathExistsSync(mockDestination)).equals(true);
  });
  
  it('Rename an invalid file, it will throw an error', async () => {
    const result = await rename({
      path: null,
      oldName: null,
      newName: null,
    });
    expect(result).to.be.an.instanceOf(Error);
  });
});
