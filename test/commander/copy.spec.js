import path from 'path';
import copy from '../../src/commander/copy';
import { template as mockTemplate } from '../mock';
import * as utils from '../../src/utils';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');

mockTemplate('Test copy', (rootPath) => {
  it('Copy an existing file, handlerInfo will be called', async () => {
    const handlerInfo = sinon.stub(utils.logger, 'info');
    expect(handlerInfo.called).equals(false);
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
    handlerInfo.restore();
  });
  it('Copy an invalid file, handlerError will be called', async () => {
    const handlerError = sinon.stub(utils.logger, 'error');
    expect(handlerError.called).equals(false);
    
    const mockSource = path.join(rootPath, 'copy');
    await copy({
      source: mockSource,
      destination: ''
    });
    expect(handlerError.called).equals(true);
    handlerError.restore();
  });
});