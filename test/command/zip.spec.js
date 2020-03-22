const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import zip from '../../src/command/zip';

describe('test zip', () => {
  let mockData;
  beforeEach(() => {
    const mockFileUrl = path.join(__dirname, '../mockFiles/zip/');
    mockData = {
      source: mockFileUrl + 'index.html',
      destination: mockFileUrl + 'index.html.zip',
      type: 'gzip',
      sourceDirectory: mockFileUrl + 'testDirectory',
      destDirectory: mockFileUrl + 'target/testDirectory.zip',
      sameDirectory: mockFileUrl + 'testDirectory/testDirectory.zip',
    };
  });
  // remove temp file
  afterEach(() => {
    fs.removeSync(mockData.destination);
    fs.removeSync(mockData.destDirectory);

  });
  it('file is zip', async () => {
    await zip({ source: mockData.source, destination: mockData.destination });
    expect(fs.pathExistsSync(mockData.destination)).to.be.true;
  });

  it('directory is zip', async () => {
    await zip({ source: mockData.sourceDirectory, destination: mockData.destDirectory });
    expect(fs.pathExistsSync(mockData.destDirectory)).to.be.true;
  });

  it('compressing directory, source and directory is same', async () => {
    await zip({ source: mockData.sourceDirectory, destination: mockData.sameDirectory });
    expect(fs.pathExistsSync(mockData.destDirectory)).to.be.false;
  });
  

});
