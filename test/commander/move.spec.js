const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import move from '../../src/commander/move';

describe('test move', () => {
  const rootPath = 'testCache';
  
  after(() => {
    fs.removeSync(rootPath);
  });
  
  it('move a valid file, it will be moved successfully', async () => {
    const mockSource = path.join(rootPath, 'move', 'index.html');
    fs.ensureFileSync(mockSource);
    const mockDestination = path.join(rootPath, 'move', 'index1.html');
    expect(fs.pathExistsSync(mockSource)).equals(true);
    
    await move({
      source: mockSource,
      destination: mockDestination
    });
    expect(fs.pathExistsSync(mockDestination)).equals(true);
  });
  
  it('move an invalid file, it will throw an error', async () => {
    const result = await move({
      source: null,
      destination: null
    });
    expect(result).to.be.an.instanceOf(Error);
  });
});
