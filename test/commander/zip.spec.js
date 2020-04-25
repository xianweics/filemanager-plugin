import path from 'path';
import zip from '../../src/commander/zip';
import { template as mockTemplate } from '../mock';
import * as utils from '../../src/utils';

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const sinon = require('sinon');

mockTemplate('Test zip', (rootPath) => {
  describe(`Test zip when type is gzip`, () => {
    it('handlerError will be called, when source is multiple or an directory',
      async () => {
        const handlerError = sinon.stub(utils, 'handlerError');
        expect(handlerError.called).equals(false);
        
        const mockSource = path.join(rootPath, 'zip');
        fs.ensureDirSync(mockSource);
        const mockDestination = path.join(rootPath, 'zip', 'index.html.gzip');
        await zip({
          source: mockSource,
          destination: mockDestination,
          type: 'gzip'
        });
        expect(handlerError.called).equals(true);
        handlerError.restore();
      });
    
    it('Gzip a valid file, handlerInfo will be called', async () => {
      const handlerInfo = sinon.stub(utils, 'handlerInfo');
      expect(handlerInfo.called).equals(false);
      
      const mockSource = path.join(rootPath, 'zip', 'index.html');
      fs.ensureFileSync(mockSource);
      const mockDestination = path.join(rootPath, 'zip', 'index.html.gz');
      expect(fs.pathExistsSync(mockSource)).equals(true);
      expect(fs.pathExistsSync(mockDestination)).equals(false);
      await zip({
        source: mockSource,
        destination: mockDestination,
        type: 'gzip'
      });
      expect(fs.pathExistsSync(mockDestination)).equals(true);
      expect(handlerInfo.called).equals(true);
      handlerInfo.restore();
    });
  });
  
  describe('Test zip when type is zip, tar or tgz', () => {
    it('Zip a valid file, it will be zipped successfully', async () => {
      const handlerInfo = sinon.stub(utils, 'handlerInfo');
      
      const mockSource = path.join(rootPath, 'zip', 'index.html');
      fs.ensureFileSync(mockSource);
      const mockDestination = path.join(rootPath, 'zip', 'index.html.zip');
      expect(fs.pathExistsSync(mockSource)).equals(true);
      expect(fs.pathExistsSync(mockDestination)).equals(false);
      
      await zip({
        source: mockSource,
        destination: mockDestination
      });
      expect(fs.pathExistsSync(mockDestination)).equals(true);
      expect(handlerInfo.called).equals(true);
      handlerInfo.restore();
    });
  });
  
  it('When source is an invalid file, handlerError will be called',
    async () => {
      const handlerError = sinon.stub(utils, 'handlerError');
      expect(handlerError.called).equals(false);
      
      await zip({
        source: '',
        destination: '',
        type: 'gzip'
      });
      expect(handlerError.called).equals(true);
      handlerError.restore();
    });
  
  it('When source is not exist, handlerError will be called',
    async () => {
      const handlerError = sinon.stub(utils, 'handlerError');
      expect(handlerError.called).equals(false);
      
      const mockSource = path.join(rootPath, 'zip');
      await zip({
        source: mockSource,
        destination: '',
        type: 'gzip'
      });
      expect(handlerError.called).equals(true);
      handlerError.restore();
    });
});
