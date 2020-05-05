import * as utils from '../../src/utils';
import unzip from '../../src/commander/unzip';
import { template as mockTemplate } from '../mock';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
//
// function createGzipFile(root, rowName, gzipName, resolve, reject) {
//   const src = path.join(root, rowName);
//   fs.ensureFileSync(root);
//   const readStream = fs.createReadStream(src);
//   const gzib = zlib.createGzip();
//   const dest = path.join(root, gzipName);
//   const writeStream = fs.createWriteStream(dest);
//   readStream
//     .pipe(gzib)
//     .pipe(writeStream)
//     .on('error', reject)
//     .on('finish', resolve);
//   return dest;
// }

mockTemplate('Test unzip', () => {
  // it('Unzip a valid file, handlerInfo will be called', async () => {
  //   const handlerInfo = sinon.stub(utils, 'handlerInfo');
  //   expect(handlerInfo.called).equals(false);
  //   await new Promise(async (resolve, reject) => {
  //     const mockSource = createGzipFile(path.join(rootPath, 'unzip'),
  //       'index.html', 'index.html.gzip', resolve, reject);
  //     const mockDestination = path.join(rootPath, 'unzip', 'index');
  //     expect(fs.pathExistsSync(mockSource)).equals(true);
  //     expect(fs.pathExistsSync(mockDestination)).equals(false);
  //
  //     try {
  //       await unzip({
  //         source: mockSource,
  //         destination: mockDestination,
  //         type: 'gzip'
  //       });
  //       expect(fs.pathExistsSync(mockDestination)).equals(true);
  //       expect(handlerInfo.called).equals(true);
  //     } finally {
  //       handlerInfo.restore();
  //     }
  //   });
  // });
  
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
