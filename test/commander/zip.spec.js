import path from 'path';
import zip from '../../src/commander/zip';
import * as utils from '../../src/utils';

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const sinon = require('sinon');

describe('Test zip', () => {
  const rootPath = 'testCache';
  
  after(() => {
    fs.removeSync(rootPath);
  });
  
  describe(`Test zip when type is gzip`, () => {
    it('handlerError will be called, when source is multiple or an directory', async () => {
      const mockSource = path.join(rootPath, 'zip');
      fs.ensureDirSync(mockSource);
      const mockDestination = path.join(rootPath, 'zip', 'index.html.gzip');
      const handlerError = sinon.stub(utils, 'handlerError').callsFake();
      await zip({
        source: mockSource,
        destination: mockDestination,
        type: 'gzip'
      });
      expect(handlerError.called).equals(true);
    });
  
    it('Gzip a valid file, it will be zipped successfully', async () => {
      const mockSource = path.join(rootPath, 'zip', 'index.html');
      fs.ensureFileSync(mockSource);
      const mockDestination = path.join(rootPath, 'zip', 'index.html.gzip');
      expect(fs.pathExistsSync(mockSource)).equals(true);
      expect(fs.pathExistsSync(mockDestination)).equals(false);

      await zip({
        source: mockSource,
        destination: mockDestination,
        type: 'gzip'
      });
      expect(fs.pathExistsSync(mockDestination)).equals(true);
    });
  });
  
  // describe('Test zip when type is zip, tar or tgz', () => {
  //   it('Zip a valid file, it will be zipped successfully', async () => {
  //     const mockSource = path.join(rootPath, 'zip', 'index.html');
  //     fs.ensureFileSync(mockSource);
  //     const mockDestination = path.join(rootPath, 'zip', 'index.html.zip');
  //     expect(fs.pathExistsSync(mockSource)).equals(true);
  //     expect(fs.pathExistsSync(mockDestination)).equals(false);
  //
  //     await zip({
  //       source: mockSource,
  //       destination: mockDestination
  //     });
  //     expect(fs.pathExistsSync(mockDestination)).equals(true);
  //   });
  // });
  
  it('Source is an invalid file, it will throw an error', async () => {
    const result = await zip({
      source: null,
      destination: null,
      type: 'gzip',
    });
    expect(result).to.be.an.instanceOf(Error);
  });
});
