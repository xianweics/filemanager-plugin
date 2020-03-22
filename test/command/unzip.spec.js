const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
import path from 'path';
import unzip from '../../src/commander/unzip';

describe('test unzip', () => {
  let mockData;
  beforeEach(() => {
    const mockFileUrl = path.join(__dirname, '../mockFiles/unzip/');
    mockData = {
      source: mockFileUrl + 'index.html.zip',
      destination: mockFileUrl + 'index.html'
    };
  });
  // remove temp file
  afterEach(() => {
    fs.removeSync(mockData.destination);
  });
  it('file is unzip', async () => {
    await unzip({ source: mockData.source, destination: mockData.destination });
    expect(fs.pathExistsSync(mockData.destination)).to.be.true;
  });
});
