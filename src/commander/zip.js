const Compressing = require('compressing');
const fsExtra = require('fs-extra');
import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';
import path from 'path';

const glob = require('glob');

/**
 * @desc Zip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<Error>}
 */
const zip = async ({ source, destination, type = 'zip' }) => {
  try {
    await fsExtra.ensureDir(path.dirname(destination));
    const sources = glob.sync(source);
    if (sources.length === 0) {
      handlerError(`zip error: '${source}' is not exist`);
      return new Error();
    }
    if (type === 'gzip') {
      // gzip
      if ((sources.length > 1 || fs.statSync(sources[0]).isDirectory())) {
        handlerError(`zip error: Gzip only support compressing a single file`);
      }
      await Compressing.gzip.compressFile(source, destination)
        .catch((e) => {
          handlerError(`zip error: ${e}`);
        });
      handlerInfo(`success: zip '${source}' to '${destination}'`);
    } else {
      // tar, zip, tgz
      const targetStream = new Compressing[type].Stream();
      for (const item of sources) {
        targetStream.addEntry(item);
      }
      targetStream.pipe(fs.createWriteStream(destination));
      handlerInfo(`success: zip '${source}' to '${destination}'`);
    }
  } catch (e) {
    handlerError(`zip error: ${e}`);
  }
};

export default zip;
