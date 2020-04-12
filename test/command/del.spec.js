const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');

import path from 'path';
import { del } from '../../src/commander';

describe('test delete', () => {
  const rootPath = 'testCache';
  
  afterEach(() => {
    fs.removeSync(rootPath);
  });
  
  it('delete an existing file, it will be deleted successfully', async () => {
    const mockPath = path.join('testCache', 'del', 'index.html');
    fs.ensureFileSync(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    await del(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(false);
  });
  
  it('delete an invalid file, it will throw an error', async () => {
    const error = await del(null);
    expect(error).to.be.an.instanceOf(Error);
  });
});