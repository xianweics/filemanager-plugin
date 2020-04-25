const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const sinon = require('sinon');
import path from 'path';
import del from '../../src/commander/del';
import * as utils from '../../src/utils';
import { template as mockTemplate } from '../mock';

mockTemplate('Test delete', (rootPath) => {
  it('Delete an existing file, handlerInfo will be called', async () => {
    const handlerInfo = sinon.stub(utils, 'handlerInfo');
    expect(handlerInfo.called).equals(false);
    
    const mockPath = path.join(rootPath, 'del', 'index.html');
    fs.ensureFileSync(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    await del(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(false);
    expect(handlerInfo.called).equals(true);
    handlerInfo.restore();
  });
  
  it('Delete an invalid file, handlerError will be called', async () => {
    const handlerError = sinon.stub(utils, 'handlerError');
    expect(handlerError.called).equals(false);
    
    await del(null);
    expect(handlerError.called).equals(true);
    handlerError.restore();
  });
});
