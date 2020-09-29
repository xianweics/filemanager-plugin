const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const sinon = require('sinon');
import path from 'path';
import del from '../../src/commander/del';
import * as utils from '../../src/utils';
import { template as mockTemplate } from '../__mock__/mock';

mockTemplate('Test delete', (rootPath) => {
  it('Delete an existing file, handlerInfo will be called', () => {
    const handlerInfo = sinon.stub(utils.logger, 'info');
    expect(handlerInfo.called).equals(false);

    const mockPath = path.join(rootPath, 'del', 'index.html');
    fs.ensureFileSync(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    
    del(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(false);
    expect(handlerInfo.called).equals(true);
    handlerInfo.restore();
  });
  
  it('Delete an invalid file, handlerError will be called', () => {
    const handlerError = sinon.stub(utils.logger, 'error');
    expect(handlerError.called).equals(false);
    
    del(null);
    expect(handlerError.called).equals(true);
    handlerError.restore();
  });
});
