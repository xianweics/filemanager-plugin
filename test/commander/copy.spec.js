import path from 'path';
import copy from '../../src/commander/copy';
import { template as mockTemplate, utils as mockUtils } from '../mock';

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const { handlerInfo, handlerError } = mockUtils;

mockTemplate('Test copy', (rootPath) => {
  it('Copy an existing file, it will be copied successfully', async () => {
    const mockSource = path.join(rootPath, 'copy', 'index.html');
    fs.ensureFileSync(mockSource);
    expect(fs.pathExistsSync(mockSource)).equals(true);
    const mockDestination = path.join('testCache', 'copy', 'index1.html');
    expect(fs.pathExistsSync(mockDestination)).equals(false);
    await copy({
      source: mockSource,
      destination: mockDestination
    });
    expect(fs.pathExistsSync(mockDestination)).equals(true);
    expect(handlerInfo.called).equals(true);
  });
  it('Copy an invalid file, it will throw an error', async () => {
    const mockSource = path.join(rootPath, 'copy');
    await copy({
      source: mockSource,
      destination: ''
    });
    expect(handlerError.called).equals(true);
  });
});