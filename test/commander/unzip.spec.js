import * as utils from '../../src/utils';
import unzip from '../../src/commander/unzip';
import { template as mockTemplate } from '../__mock__/mock';
import path from 'path';

const fs = require('fs-extra');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

mockTemplate('Test unzip', (rootPath) => {
  it('Unzip a valid file, handlerInfo will be called', async () => {
    const handlerInfo = sinon.stub(utils.logger, 'info');
    expect(handlerInfo.called).equals(false);
    
    const mockSource = path.join(rootPath, 'unzip');
    fs.emptyDirSync(mockSource);
    expect(fs.pathExistsSync(mockSource)).equals(true);
    
    await unzip({
      source: path.join(__dirname, '../__mock__/unzip/a.tar'),
      destination: mockSource,
      type: 'tar'
    });
    
    expect(fs.pathExistsSync(path.join(mockSource, 'cp2', 'index.html'))).equals(true);
    expect(handlerInfo.called).equals(true);
    handlerInfo.restore();
  });
  
  it('Unzip an invalid file, handlerError will be called', async () => {
    const handlerError = sinon.stub(utils.logger, 'error');
    expect(handlerError.called).equals(false);
    
    await unzip({
      source: '',
      destination: ''
    });
    expect(handlerError.called).equals(true);
    handlerError.restore();
  });
});
