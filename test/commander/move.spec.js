import * as utils from '../../src/utils';
import path from 'path';
import move from '../../src/commander/move';
import { template as mockTemplate } from '../__mock__/mock';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');

mockTemplate('Test move', (rootPath) => {
  it('Move a valid file, handlerInfo will be called', () => {
    const handlerInfo = sinon.stub(utils.logger, 'info');
    expect(handlerInfo.called).equals(false);
    
    const mockSource = path.join(rootPath, 'move', 'index.html');
    fs.ensureFileSync(mockSource);
    expect(fs.pathExistsSync(mockSource)).equals(true);
  
    const mockDestination = path.join(rootPath, 'move', 'dist');
    expect(fs.pathExistsSync(mockDestination)).equals(false);
    
    move({
      source: mockSource,
      destination: mockDestination
    });
    expect(fs.pathExistsSync(path.join(mockDestination, 'index.html'))).equals(true);
    expect(handlerInfo.called).equals(true);
    handlerInfo.restore();
  });
  
  
  it('Move an invalid file, handlerError will be called', () => {
    const handlerError = sinon.stub(utils.logger, 'error');
    expect(handlerError.called).equals(false);
    
    const result = move({
      source: null,
      destination: null
    });
    expect(handlerError.called).equals(true);
    expect(result).to.be.an('undefined');
    handlerError.restore();
  });
});
