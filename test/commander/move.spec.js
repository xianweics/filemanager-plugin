import * as utils from '../../src/utils';
import path from 'path';
import move from '../../src/commander/move';
import { template as mockTemplate } from '../mock';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');

mockTemplate('Test move', (rootPath) => {
  it('Move a valid file, handlerInfo will be called', async () => {
    const handlerInfo = sinon.stub(utils, 'handlerInfo');
    expect(handlerInfo.called).equals(false);
    
    const mockSource = path.join(rootPath, 'move', 'index.html');
    fs.ensureFileSync(mockSource);
    const mockDestination = path.join(rootPath, 'move', 'index1.html');
    expect(fs.pathExistsSync(mockSource)).equals(true);
    expect(fs.pathExistsSync(mockDestination)).equals(false);
    await move({
      source: mockSource,
      destination: mockDestination
    });
    expect(fs.pathExistsSync(mockDestination)).equals(true);
    expect(handlerInfo.called).equals(true);
    handlerInfo.restore();
  });
  
  it('Move an invalid file, handlerError will be called', async () => {
    const handlerError = sinon.stub(utils, 'handlerError');
    expect(handlerError.called).equals(false);
    
    await move({
      source: null,
      destination: null
    });
    expect(handlerError.called).equals(true);
    handlerError.restore();
  });
});
