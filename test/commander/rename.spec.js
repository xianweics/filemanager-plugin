import * as utils from '../../src/utils';
import path from 'path';
import rename from '../../src/commander/rename';
import { template as mockTemplate } from '../mock';

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const sinon = require('sinon');

mockTemplate('Test rename', (rootPath) => {
  it('Rename a valid file, handlerInfo will be called', async () => {
    const handlerInfo = sinon.stub(utils, 'handlerInfo');
    const mockOldName = 'index.html';
    const mockNewName = 'index1.html';
    const mockSource = path.join(rootPath, 'rename', mockOldName);
    fs.ensureFileSync(mockSource);
    const mockPath = path.join(rootPath, 'rename');
    const mockDestination = path.join(rootPath, 'rename', mockNewName);
    expect(fs.pathExistsSync(mockSource)).equals(true);
    expect(fs.pathExistsSync(mockDestination)).equals(false);
    await rename({
      path: mockPath,
      oldName: mockOldName,
      newName: mockNewName,
    });
    expect(fs.pathExistsSync(mockDestination)).equals(true);
    handlerInfo.restore();
  });
  
  it('Rename an invalid file, it will throw an error', async () => {
    const handlerError = sinon.stub(utils, 'handlerError');
    expect(handlerError.called).equals(false);
    
    await rename({
      path: null,
      oldName: null,
      newName: null,
    });
    expect(handlerError.called).equals(true);
    handlerError.restore();
  });
});
