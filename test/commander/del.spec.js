const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');

import path from 'path';
import del from '../../src/commander/del';

describe('Test delete', () => {
  const rootPath = 'testCache';
  
  afterEach(() => {
    fs.removeSync(rootPath);
  });
  
  it('Delete an existing file, it will be deleted successfully', async () => {
    const mockPath = path.join('testCache', 'del', 'index.html');
    fs.ensureFileSync(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    await del(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(false);
  });
  
  it('Delete an invalid file, it will throw an error', async () => {
    const result = await del(null);
    expect(result).to.be.an.instanceOf(Error);
  });
});
