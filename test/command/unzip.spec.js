const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import unzip from '../../src/commander/unzip';

describe('test unzip', () => {
  const rootPath = 'testCache';
  
  after(() => {
    fs.removeSync(rootPath);
  });
  
  it('unzip a valid file, it will be unzipped successfully', async () => {
    const mockSource = path.join(rootPath, 'unzip', 'index.html.gzip');
    fs.ensureFileSync(mockSource);
    const mockDestination = path.join(rootPath, 'unzip', 'index.html');
    expect(fs.pathExistsSync(mockSource)).equals(true);
    await unzip({
      source: mockSource,
      destination: mockDestination,
      type: 'gzip'
    });
    expect(fs.pathExistsSync(mockDestination)).equals(true);
  });
  
  it('unzip an invalid file, it will throw an error', async () => {
    const error = await unzip({
      source: '',
      destination: ''
    });
    expect(error).to.be.an.instanceOf(Error);
  });
  
  it('unzip an empty file, it will throw an error', async () => {
    const mockSource = path.join(rootPath, 'unzip', 'index1.html.gzip');
    const error = await unzip({
      source: mockSource,
      destination: ''
    });
    expect(error).to.be.an.instanceOf(Error);
  });
});
